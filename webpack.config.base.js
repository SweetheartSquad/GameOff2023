const HtmlWebpackPlugin = require('html-webpack-plugin');
const ChunkProgressWebpackPlugin = require('chunk-progress-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const pkg = require('./package');

module.exports = (env, argv) => ({
	module: {
		rules: [
			{
				test: /\.(j|t)s?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/, // stylesheets
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									require('autoprefixer')(),
									require('postcss-clean')(),
								],
							},
						},
					},
				],
			},
			{
				test: /(?<!\.fnt)\.(png|jpg|gif|webp|wav|ogg|mp3|glsl|xml|strand|txt|gltf|glb)$/,
				type: 'asset/resource',
			},
			{
				test: /(otf|ttf|woff)$/,
				type: 'asset/inline',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			path: false,
		},
		alias: {
			'@pixi/sprite': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/sprite'
			),
			'@pixi/assets': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/assets'
			),
			'@pixi/display': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/display'
			),
			'@pixi/ticker': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/ticker'
			),
			'@pixi/utils': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/utils'
			),
			'@pixi/constants': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/constants'
			),
			'@pixi/math': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/math'
			),
			'@pixi/settings': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/settings'
			),
			'@pixi/core': path.resolve(
				__dirname,
				'node_modules/pixi.js/node_modules/@pixi/core'
			),
		},
	},
	output: {
		filename: '[name].[contenthash].bundle.js',
		assetModuleFilename:
			argv.mode === 'development' ? undefined : 'assets/[name][ext][query]',
		clean: true,
	},
	plugins: [
		new ChunkProgressWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'assets/**/*.{png,jpg,gif,webp,mp3,ogg,glsl,txt,fnt,gltf,glb}',
					context: 'src',
				},
			],
		}),
		new HtmlWebpackPlugin({
			// creates index.html
			title: pkg.description,
			template: './src/index.html',
			minify: true,
			hash: true,
			favicon: './src/assets/icon.png',
		}),
	],
});
