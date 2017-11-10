import configureStore from '../client/store/configureStore'
import { Provider } from 'react-redux'
import serversReducer from '../client/reducers/reducer'
import { renderToString } from 'react-dom/server'
import Main from '../client/containers/Main'
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const app = new Koa()
const router = new Router()
const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')
const React = require('react')
const config = require('./config')
const routes = require('./routes')
const mongoose = require('mongoose')
const stateSchema = require('./models/State')
const emailSchema = require('./models/Email')
const mission = require('./models/port')
const port = process.env.PORT || config.port
const store = configureStore()

mongoose.connect('mongodb://127.0.0.1:27017/monitor', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
var State = mongoose.model("State", stateSchema);
var Email = mongoose.model("Email", emailSchema);

// error handler
onerror(app)
// middlewares
app.use(bodyparser())
    .use(json())
    .use(logger())
    .use(cors())
    .use(require('koa-static')(__dirname + '/dist'))
    .use(views(path.join(__dirname, '/views'), {
        options: {
            settings: {
                views: path.join(__dirname, 'views')
            }
        },
        map: {
            'ejs': 'ejs'
        },
        extension: 'ejs'
    }))
    .use(router.routes())
    .use(router.allowedMethods())

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - $ms`)
})

router.get('/', async(ctx, next) => {

    /*const staticMarkup = renderToString(
        <Provider store={store}>
            <Main />
        </Provider>
    )
    await next()
    const preloadedState = store.getState();
    await ctx.render('index', {
        reduxData: preloadedState,
        renderView: staticMarkup
    })*/
    ctx.body = 'ok';
    await ctx.render('index', {
        reduxData: store.getState(),
        renderView: renderToString(
            <Provider store={store}>
                <Main />
            </Provider>
        )
    })

})

router.post('/show', async(ctx, next) => {

    ctx.body = 'ok';
    await State.find({}, function(err, doc) {
        let newArray = [];
        if (err) {
            return;
        }
        doc.forEach(function(element, index) {
            newArray.push(element);
        })
        ctx.response.body = JSON.stringify(newArray);
    })

})

router.post('/edit', async(ctx, next) => {

    ctx.body = 'ok'
    await State.update({
        _id: ctx.request.body.querymark
    }, {
        $set: {
            server_name: ctx.request.body.servername,
            jp_name: ctx.request.body.jpname,
            ip_address: ctx.request.body.ipaddress,
            port: ctx.request.body.port,
            priority: ctx.request.body.priority
        }
    }, function(err, doc) {
        if (err) {
            console.log(err.toString());
        } else {

        }
    })
    await next()
})

router.post('/create', async(ctx, next) => {

    ctx.body = 'ok'
    await new State({
        server_name: ctx.request.body.servername,
        jp_name: ctx.request.body.jpname,
        ip_address: ctx.request.body.ipaddress,
        port: ctx.request.body.port,
        priority: ctx.request.body.priority
    }).save(function(err) {
        if (err) {
            console.log(err.toString());
        }
    })
})

router.post('/delete', async(ctx, next) => {

    await State.remove({
        _id: ctx.request.body.id
    }, function(err, doc) {
        if (err) {
            return;
        }
        ctx.body = 'ok'
    });
})

app.on('error', function(err, ctx) {
    console.log(err)
    log.error('server error', err, ctx)
})

export default app;