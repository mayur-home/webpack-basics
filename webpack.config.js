var path = require('path');
var webpack = require('webpack');

module.exports = {
	// every entry points are considered as separate modules. Compilation process creates
	// seperate output files for each of the module
	entry: {
		main: './app/index.js',
		momentMain: 'moment',
		jsxtest: './app/test.jsx'
	},

	// This is required file which actually decide where to place compiled version of
	// each module
	output: {
		filename: '[name].[chunkhash:16].js',
		path: path.resolve(__dirname, 'build')
	},

	plugins: [
		// The `CommonsChunkPlugin` is an opt-in feature that creates a separate file (known as a chunk),
		// consisting of common modules shared between multiple entry points. By separating common
		// modules from bundles, the resulting chunked file can be loaded once initially, and stored in
		// cache for later use. This results in pagespeed optimizations as the browser can quickly serve the
		// shared code from cache, rather than being forced to load a larger bundle whenever a new page is visited.
		// https://webpack.js.org/plugins/commons-chunk-plugin/
	    new webpack.optimize.CommonsChunkPlugin({
	        name: 'vendor',  // Specify the common bundle's name.
	        minChunks: function (module) {
	            // this assumes your vendor imports exist in the node_modules directory
	            return module.context && module.context.indexOf('node_modules') !== -1;
	        }
	    })
	    ,
	    // CommonChunksPlugin will now extract all the common modules from vendor and main bundles
	    new webpack.optimize.CommonsChunkPlugin({
	        name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
	    })
	    ,
	    new webpack.optimize.UglifyJsPlugin()
	],

	module: {
		// This is to apply rules on module files. e.g. transpilation of es6 into es5 can be done here
		// also sass compilation etc.
		rules: [
			{
				test: /\.jsx?$/,
				include: [
					path.resolve(__dirname, "app")
				],
				loader: 'babel-loader',
				options: {
					presets: [
						'es2015'
					]
				}
			}
		]
	},

	/**
	 * @document
	 * import "testModule";
	 * import "testModule/lib/file";
	 *
	 * Modules are searched for inside all directories specified in resolve.modules.
	 * Here `testModule` would be searched within `node_modules` directory.
	 */
	// https://webpack.js.org/concepts/module-resolution/
	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, "node_modules")
		],
		extensions: [".js", ".json", ".jsx", ".css"]
	}
};
