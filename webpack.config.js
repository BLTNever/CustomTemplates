var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var path = require('path');
var packageOpts = require('./package.json');
var dependencies = packageOpts.dependencies;
var Libs = Object.keys(dependencies)
Libs.splice(0, 1);
// console.info(`- 部署环境: ${ENV}`)
// console.info(`- 静态文件路径: ${CDN_PATH}`)
console.info(`- 加载依赖模块: ${Libs.join()}`)

module.exports = {
    // devtool: 'eval-source-map',
    devtool: 'source-map',
    // devtool: 'eval',
    // entry: path.resolve(__dirname + "/src/index.js"),
    entry: {
        'app': [
            // 'babel-polyfill',
            'webpack-dev-server/client?http://localhost:3000',
            'webpack/hot/only-dev-server',
            'react-hot-loader/patch',
            './src/index.js'
        ],
        'vendor': Libs,
        // [
        //   'babel-polyfill','global','immutable','invariant','is-plain-object','isomorphic-fetch','nprogress','react','react-color','react-dom','react-hot-loader','react-redux','react-router','react-router-dom','redux','redux-immutable','redux-saga'
        // ]
    },
    output: {
        path: path.resolve(__dirname + "/dist"),
        filename: '[name].[hash].js',
        // filename: '[chunkhash].[name].js',
        // filename: 'bundle.js',
        // publicPath: '/static/'
    },

    module: {
        loaders: [
            // {
            //   test: /\.json$/,
            //   loader: "json-loader"
            // },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                // include: path.resolve(__dirname, './src'),
            },
            {
                test: /\.css$/,
                // include: __dirname + "/src",
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?module&importLoaders=1&localIdentName=[local]___[hash:base64:5]!postcss-loader' }),
                // loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?module&importLoaders=1&localIdentName=[local]!postcss-loader' }),
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
                include: [path.resolve(__dirname, './node_modules/antd/lib/'), path.resolve(__dirname, './node_modules/react-quill/dist/')]
            },
            {
                test: /\.(gif|jpg|png|svg|ico|woff|eot|ttf)$/,
                loader: 'url-loader?limit=2048&name=assets/[name].[hash:8].[ext]',//2k以下的文件会使用base64
                include: path.resolve(__dirname, './src'),
            },
        ]
    },
    // resolve: {
    //   alias: {
    //     'redux-devtools/lib': path.join(__dirname, '..', '..', 'src'),
    //     'redux-devtools': path.join(__dirname, '..', '..', 'src'),
    //     'react': path.join(__dirname, 'node_modules', 'react')
    //   },
    //   extensions: ['', '.js']
    // },
    // resolveLoader: {
    //   'fallback': path.join(__dirname, 'node_modules')
    // },
    resolve: {
        extensions: [".js", ".json"]
    },
    plugins: [
        new webpack.BannerPlugin("Copyright TY"),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname + "/src/index.tmpl.html")
        }),
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'] // 指定公共 bundle 的名字。
        }),
        new ExtractTextPlugin("[name].[hash].css"),
        new webpack.HotModuleReplacementPlugin(),//热加载插件
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [precss, autoprefixer];
                },
                // devServer: {
                //   // contentBase: "./src",//本地服务器所加载的页面所在的目录
                //   colors: true,//终端中输出结果为彩色
                //   historyApiFallback: true,//如果设置为true，所有的跳转将指向index.html
                //   inline: true,//实时刷新
                //   hot: true,
                // },
            }
        })
    ],

}