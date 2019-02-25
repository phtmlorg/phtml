"use strict";

module.exports = {
	plugins: [
		['@babel/proposal-class-properties', {
			loose: true
		}],
		['transform-async-to-promises', {
			inlineHelpers: true
		}],
		['transform-for-of-as-array', {
			loose: true
		}]
	],
	presets: [
		['@babel/env', {
			loose: true,
			modules: false,
			targets: { node: 6 },
			useBuiltIns: 'entry'
		}]
	]
};
