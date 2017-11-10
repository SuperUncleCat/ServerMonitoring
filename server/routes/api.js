import Router from 'koa-router'
const router = new Router()
router.prefix('/api')

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

    //ctx.body = 'ok';
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

export default router