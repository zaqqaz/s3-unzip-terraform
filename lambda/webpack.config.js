const path = require('path');

module.exports = {
    target: 'node',
    entry: './src/index.ts',
    output: {
        libraryTarget: "commonjs",
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
};
