var webpack = require('webpack');

module.exports = {
    entry: {
        index: "./src/index.tsx"
    },
    output: {
        publicPath : '/',
        path: './build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "typescript-simple-loader" }
        ],
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.ts', '.tsx']
    }
};
