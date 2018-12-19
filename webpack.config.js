const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const outputDir = path.resolve(__dirname, 'dist');

module.exports = {
    mode: "production",
    entry: './src/js/main.js',
    output: {
        filename: 'main.js',
        path: outputDir
    },
    plugins: [
        new CopyWebpackPlugin(
            [
                { from: './src/index.html', to: outputDir },
                { from: './node_modules/bootstrap/dist/css/bootstrap.min.css', to: outputDir }
            ])
    ],
    devServer: {
        contentBase: outputDir,
        compress: true,
        port: 9000
    }
};
