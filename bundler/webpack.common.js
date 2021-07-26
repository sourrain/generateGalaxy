const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    entry: {
        index: path.resolve(__dirname, '../src/script.js'),
        galaxy2: path.resolve(__dirname, '../src/galaxy2.js'),
        galaxy3: path.resolve(__dirname, '../src/galaxy3.js'),
        galaxy4: path.resolve(__dirname, '../src/galaxy4.js'),
    },
    output:
    {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    plugins:
        [
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, '../static') }
                ]
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                chunks: ['index'],
                template: path.resolve(__dirname, '../src/index.html'),
                minify: true
            }),
            new HtmlWebpackPlugin({
                filename: 'galaxy2.html',
                chunks: ['galaxy2'],
                template: path.resolve(__dirname, '../src/galaxy2.html'),
                minify: true
            }),
            new HtmlWebpackPlugin({
                filename: 'galaxy3.html',
                chunks: ['galaxy3'],
                template: path.resolve(__dirname, '../src/galaxy3.html'),
                minify: true
            }),
            new HtmlWebpackPlugin({
                filename: 'galaxy4.html',
                chunks: ['galaxy4'],
                template: path.resolve(__dirname, '../src/galaxy4.html'),
                minify: true
            }),
            new MiniCSSExtractPlugin()
        ],
    module:
    {
        rules:
            [
                // HTML
                {
                    test: /\.(html)$/,
                    use: ['html-loader']
                },

                // JS
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use:
                        [
                            'babel-loader'
                        ]
                },

                // CSS
                {
                    test: /\.css$/,
                    use:
                        [
                            MiniCSSExtractPlugin.loader,
                            'css-loader'
                        ]
                },

                // Images
                {
                    test: /\.(jpg|png|gif|svg)$/,
                    use:
                        [
                            {
                                loader: 'file-loader',
                                options:
                                {
                                    outputPath: 'assets/images/'
                                }
                            }
                        ]
                },

                // Fonts
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use:
                        [
                            {
                                loader: 'file-loader',
                                options:
                                {
                                    outputPath: 'assets/fonts/'
                                }
                            }
                        ]
                },
                //Shaders
                {
                    test: /\.(glsl|vs|fs|vert|frag)$/,
                    exclude: /node_modules/,
                    use:
                        [
                            'raw-loader'
                        ]
                }

            ]
    }
}
