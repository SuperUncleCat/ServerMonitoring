require('babel-polyfill')
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path')

module.exports = {
    entry: {
        app: [
            'react-hot-loader/patch',
            'webpack-hot-middleware/client',
            'webpack/hot/only-dev-server',
            'babel-polyfill', path.resolve(__dirname, '.', 'client/app')
        ],
        vendors: [
            'react',
            'redux',
            'react-dom',
            'react-redux'
        ],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    //publicPath: '/dist/'
    },
    devtool: 'cheap-source-map',
    devServer: {
        contentBase: 'dist',
        historyApiFallback: true,
        inline: true,
        hot: true,
        port: 8080
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.bundle.js'
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                __SERVER__: false
            }
        }),
        new ExtractTextPlugin("dist/[name].css", {
            allChunks: true
        }),
    ],
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader?cacheDirectory',
            query: {
                presets: ['es2015', 'stage-0', 'react', 'react-hmre'],
                plugins: ['react-hot-loader/babel'],
            },
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
        }, {
            test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }]
        }, {
            test: /\.ejs$/,
            loader: 'ejs-loader?variable=data'
        },]
    }
};