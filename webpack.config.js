var path = require('path')
var webpack = require('webpack')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    entry: [
        path.resolve(__dirname, 'client/app'),
        'react',
        'react-dom',
        'react-redux',
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, './server/public')
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: [
                'react',
                'react-dom',
                'react-redux',
            ],
            minChunks: Infinity
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader?cacheDirectory',
            query: {
                presets: ['es2015', 'stage-0', 'react']
            },
        }]
    }
}