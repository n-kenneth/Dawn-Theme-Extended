const path = require('path')
const glob = require('glob')
const WatchExternalFilesPlugin = require( 'webpack-watch-files-plugin').default
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')

const mode = process.env.NODE_ENV || 'development'

// Build entries locations based on the filenames in "entry" directory
const entries = {}
glob.sync('./custom/scss/entry/**.scss').map(function(el){
	const filename = path.parse(el).name
	entries[filename] === undefined ? entries[filename] = [el] : entries[filename].push(el)
});

glob.sync('./custom/js/entry/**.js').map(function(el){
	const filename = path.parse(el).name
	entries[filename] === undefined ? entries[filename] = [el] : entries[filename].push(el)
});

// Build pages entries
glob.sync('./custom/scss/pages/**.scss').map(function(el){
	const filename = path.parse(el).name
	entries[filename] === undefined ? entries[filename] = [el] : entries[filename].push(el)
});

glob.sync('./custom/js/pages/**.js').map(function(el){
	const filename = path.parse(el).name
	entries[filename] === undefined ? entries[filename] = [el] : entries[filename].push(el)
});

console.log(entries);
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
				test: /\.(js|jsx)$/,
				resolve: {
					extensions: [".js", ".jsx"]
				},
				exclude: /node_modules/,
				use: ['babel-loader']
			}
		]
	},
	plugins: [
		new RemoveEmptyScriptsPlugin(),
		// extract css into its own file
		new MiniCssExtractPlugin({
			filename: '[name].bundled.css'
		}),
		// watch for file changes
		new WatchExternalFilesPlugin({
      files: [
        './custom/**'
      ]
    })
	],
}
