const path = require('path');
const { EsbuildPlugin } = require('esbuild-loader');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		minimizer: [
			new EsbuildPlugin({
				target: 'es2015',  // Syntax to transpile to (see options below for possible values)
				css: true,
			})
		]
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.[jt]sx?$/,
				loader: 'esbuild-loader',
				options: {
					target: 'es2015',
					loader: 'jsx',
				},
			},
		],
	},
	plugins: [
		new EsbuildPlugin({
			define: {
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			}
		})
	],
	devServer: {
		client: {
			overlay: {
				errors: true,
				warnings: false,
				runtimeErrors: true,
			},
		},
	},
};
