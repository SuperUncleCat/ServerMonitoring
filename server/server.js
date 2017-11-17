import configureStore from '../client/store/configureStore'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import Nav from '../client/containers/Nav'
import Main from '../client/containers/Main'
//import AppRoot from '../client/app-root'
import { StaticRouter } from 'react-router'
const historyFallback = require('koa2-history-api-fallback')
//import router from './routes'
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
//const routes = require('./routes')
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
    .use(historyFallback())

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
    let context = {}
    await ctx.render('index', {
        reduxData: store.getState(),
        renderView: renderToString(
            <Provider store={store}>
                <StaticRouter location={ctx.request.url} context={context}>
                    <Nav />
                </StaticRouter>
            </Provider>,
        )
    })

})

router.post('/show', async(ctx, next) => {

    //ctx.body = 'ok'
    let newArray = [];
    await State.find({}, function(err, doc) {
        if (err) {
            return;
        }
        doc.forEach(function(element, index) {
            newArray.push(element);
        })
        ctx.body = JSON.stringify(newArray);
    }).sort({
        priority: 1
    })
})


router.post('/mailshow', async(ctx, next) => {

    let mailArray = [];
    await Email.find({}, function(err, doc) {
        if (err) {
            return;
        }
        doc.forEach(function(element, index) {
            mailArray.push(element);
        })
    })
    ctx.response.body = JSON.stringify(mailArray);
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
            is_check: ctx.request.body.ischeck,
            p_check: ctx.request.body.pcheck,
            count: ctx.request.body.count,
            email_mark: ctx.request.body.emailmark,
            email_sent: ctx.request.body.emailsent,
            p_count: ctx.request.body.pcount,
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

router.post('/mailedit', async(ctx, next) => {

    ctx.body = 'ok'
    await Email.update({
        _id: ctx.request.body.querymark
    }, {
        $set: {
            email_address: ctx.request.body.emailaddress,
            status: ctx.request.body.status
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
        is_check: ctx.request.body.ischeck,
        p_check: ctx.request.body.pcheck,
        port: ctx.request.body.port,
        priority: ctx.request.body.priority
    }).save(function(err) {
        if (err) {
            console.log(err.toString());
        }
    })
})

router.post('/mailcreate', async(ctx, next) => {

    ctx.body = 'ok'
    await new Email({
        email_address: ctx.request.body.emailaddress,
        status: ctx.request.body.status
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

router.post('/maildelete', async(ctx, next) => {

    await Email.remove({
        _id: ctx.request.body.id
    }, function(err, doc) {
        if (err) {
            return;
        }
        ctx.body = 'ok'
    });
})

//routes(router)
app.on('error', function(err, ctx) {
    console.log(err)
    log.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`)
    console.log(__dirname);
})
//export default app;