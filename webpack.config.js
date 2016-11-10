var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    entry: {
        lib: ['./lib/lib.tsx'],
        app: "./src/index.tsx"
    },
    output: {
        publicPath : '/',
        path: './build',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
        new CommonsChunkPlugin("lib", "lib.bundle.js")
    ]
};
