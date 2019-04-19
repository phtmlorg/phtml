"use strict";

module.exports = {
	plugins: [
		['@babel/proposal-class-properties', {
			loose: true
		}],
		['transform-for-of-as-array', {
			loose: true
		}]
	],
	presets: [
		['@babel/env', {
			corejs: 3,
			loose: true,
			modules: false,
			targets: { node: 6 },
			useBuiltIns: 'entry'
		}]
	]
};
