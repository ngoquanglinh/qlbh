const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index.bundle.js',
    },
    devServer: {
        port: 3000,
        watchContentBase: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    plugins: [new MiniCssExtractPlugin()],
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, './src'),
        }

    }
};