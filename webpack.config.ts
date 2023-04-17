import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
	mode: 'development',
	entry: './src/app/index.tsx',
	output: {
		path: path.resolve(__dirname, 'static'),
		filename: 'app.bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{ test: /\.(ts|tsx)$/, loader: 'ts-loader' },
			{ test: /\.s[ac]ss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
		],
	},
};

export default config;
