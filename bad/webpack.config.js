var path = require("path");
var HtmlWebpackPlugin =  require("html-webpack-plugin");
var ManifestPlugin = require("webpack-manifest-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")

module.exports = {
    entry : "./src/index.js",
    devtool: "source-map",
    output : {
        path : path.resolve(__dirname , "build"),
        filename: "index_bundle.js"
    },
    module : {
        rules : [
            {test : /\.(js)$/, use:"babel-loader"},
            {test : /\.css$/, use:["style-loader", "css-loader"]}
        ]
    },
    mode:"development",
    devServer: {
      contentBase: "./build",
      compress: true,
    },
    plugins : [
        new HtmlWebpackPlugin ({
            template : "public/index.html"
        }),
        new ManifestPlugin(),
        new FaviconsWebpackPlugin("public/favicon.ico")
    ]

}
