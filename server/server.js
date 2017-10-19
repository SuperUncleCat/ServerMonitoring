import { createStore } from 'redux'
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
const mission = require('./models/port')
const port = process.env.PORT || config.port
const store = createStore(serversReducer)

mongoose.connect('mongodb://127.0.0.1:27017/monitor', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
var State = mongoose.model("State", stateSchema);

// error handler
onerror(app)
// middlewares
app.use(bodyparser())
    .use(json())
    .use(logger())
    .use(cors())
    .use(require('koa-static')(__dirname + '/public'))
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

    const staticMarkup = renderToString(
        <Provider store={store}>
            <Main />
        </Provider>
    )
    const preloadedState = store.getState();
    await next()
    await ctx.render('index', {
        reduxData: preloadedState,
        root: staticMarkup
    })

})

router.post('/show', async(ctx, next) => {

    ctx.body = 'ok';
    let newArray = [];
    await State.find({}, function(err, doc) {
        if (err) {
            return;
        }
        doc.forEach(function(element, index) {
            newArray.push(element);
        })
    })
    ctx.response.body = JSON.stringify(newArray);
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
            return;
        } else {
        }
    })
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
        if (err)
            console.log(err.toString());
    })
})

router.post('/delete', async(ctx, next) => {

    ctx.body = 'ok'
    await State.remove({
        _id: ctx.request.body.id
    }, function(err, doc) {
        if (err) {
            return;
        }
    });
})

routes(router)
app.on('error', function(err, ctx) {
    console.log(err)
//logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`)
    console.log(__dirname);
})