const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WatchExternalFilesPlugin = require( 'webpack-watch-files-plugin').default
const glob = require('glob')

const mode = process.env.NODE_ENV || 'development'

// Build entries locations based on the filenames in "entry" directory
const entries = {}
glob.sync('./assets/custom/scss/entry/**.scss').map(function(el){
	const filename = path.parse(el).name
	entries[filename] === undefined ? entries[filename] = [el] : entries[filename].push(el)
});

glob.sync('./assets/custom/js/entry/**.js').map(function(el){
	const filename = path.parse(el).name
	entries[filename] === undefined ? entries[filename] = [el] : entries[filename].push(el)
});


module.exports = {
	mode,
	entry: entries,
	output: {
		path:  path.resolve(__dirname, 'assets'),
    publicPath: '/',
    filename: '[name].bundled.js',
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader', 
					'sass-loader', 
					'postcss-loader'
				],
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			}
		]
	},
	plugins: [
		// extract css into its own file
		new MiniCssExtractPlugin({
			filename: '[name].bundled.css'
		}),
		// watch for file changes
		new WatchExternalFilesPlugin({
      files: [
        './assets/custom/**'
      ]
    })
	]
}