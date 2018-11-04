const path = require('path');

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname + '/app/src'),
    output: {
        path: path.resolve(__dirname + "/app/dist"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(.css)/,
                include: [
                    path.resolve(__dirname + "/app/src")
                ],
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },
            {
                test: /\.css$/,
                loader: 'css-loader'
            }
        ]
    },
};