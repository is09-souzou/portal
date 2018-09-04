const { DefinePlugin }     = require ("webpack")
const path                 = require("path");
const convert              = require('koa-connect');
const history              = require('connect-history-api-fallback');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Uglify               = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    mode: "production",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        // new Uglify({
        //     sourceMap: false,
        //     uglifyOptions: {
        //         ecma: 8,
        //         // mangle: {
        //         //     properties: true
        //         // },
        //         output: {
        //             // comments: "@license",
        //             beautify: false
        //         },
        //     }
        // }),
        // new BundleAnalyzerPlugin(),
        new DefinePlugin(
            Object.entries(process.env)
                .map(x => ({["process.env." + x[0]]: JSON.stringify(x[1])}))
                .reduce((x, y) => Object.assign(x, y), {}),
        )
    ],
    serve: {
        add: (app, middleware, options) => {
            app.use(convert(history()));
        },
        content: path.resolve(__dirname, 'assets'),
        open: true
    }
};