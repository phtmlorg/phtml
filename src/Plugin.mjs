import Result from './Result';

/**
* @name Plugin
* @class
* @classdesc Create a new Plugin.
* @param {String} name - Name of the Plugin.
* @param {Function} pluginFunction - Function executed by the Plugin.
* @return {Plugin}
* @example
* new Plugin('phtml-test', pluginOptions => {
*   // initialization logic
*
*   return (root, result) => {
*     // runtime logic
*   }
* })
*/
class Plugin extends Function {
	constructor (name, pluginFunction) {
		return Object.defineProperties(pluginFunction, {
			constructor: {
				value: Plugin,
				configurable: true
			},
			type: {
				value: 'plugin',
				configurable: true
			},
			name: {
				value: String(name || 'phtml-plugin'),
				configurable: true
			},
			pluginFunction: {
				value: pluginFunction instanceof Function
					? pluginFunction
				: () => {},
				configurable: true
			},
			process: {
				value(...args) {
					return Plugin.prototype.process.apply(this, args);
				},
				configurable: true
			}
		});
	}

	/**
	* Process input with options and plugin options and return the result
	* @param {String} input - Source being processed.
	* @param {Object} processOptions - Custom settings applied to the Result.
	* @param {Object} pluginOptions - Options passed to the Plugin.
	* @return {Result}
	* @example
	* plugin.process('some html', processOptions, pluginOptions)
	*/
	async process (input, processOptions, pluginOptions) {
		const result = new Result(input, processOptions);

		result.root = await result.root;

		await this.pluginFunction(pluginOptions)(result.root, result);

		return result;
	}
}

export default Plugin;
