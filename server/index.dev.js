// Javascript require hook
require('babel-register')({
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['transform-runtime']
})
const app = require('./server.dev').default
const webpack = require('webpack')
const devMiddleware = require('koa-webpack-dev-middleware')
const hotMiddleware = require('koa-webpack-hot-middleware')
const config = require('../webpack.dev')
const compile = webpack(config)
console.log(__dirname)
app.use(devMiddleware(compile, {
    noInfo: true,
    publicPath: config.output.publicPath
}))
app.use(hotMiddleware(compile))
app.listen(80);