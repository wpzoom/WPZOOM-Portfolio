const defaultConfig = require( './node_modules/@wordpress/scripts/config/webpack.config.js' );
const glob = require( 'glob' );
const path = require( 'path' );
const postcssPresetEnv = require( 'postcss-preset-env' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const IgnoreEmitPlugin = require( 'ignore-emit-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const production = process.env.NODE_ENV === 'production';

const entryObject = glob.sync( './src/{,blocks/*/}{{index,script}.js,{style,editor}.scss}' ).reduce( ( acc, item ) => {
	acc[ item.replace( /^\.\/src\/(.+)\/*\.(js|scss)$/i, '$1' ) ] = item;
	return acc;
}, {} );

module.exports = {
	...defaultConfig,
	entry: entryObject,
	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'build' )
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.(sc|sa|c)ss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: { sourceMap: ! production }
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: () => [
								postcssPresetEnv( {
									stage: 3,
									features: {
										'custom-media-queries': { preserve: false },
										'custom-properties': { preserve: true },
										'nesting-rules': true
									},
									autoprefixer: { grid: true }
								} )
							]
						}
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: ! production }
					}
				]
			}
		]
	},
	plugins: [
		...defaultConfig.plugins,
		new MiniCssExtractPlugin( { filename: '[name].css' } ),
		new IgnoreEmitPlugin( [ 'editor.js', 'style.js' ] ),
		new CopyPlugin( [ { from: 'src/**/*.php', to: 'build/', transformPath( t, a ) { return t.replace( /build\\src\\/, '' ); } } ] )
	]
};