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
class Plugin {
	constructor (name, pluginFunction) {
		Object.assign(this, {
			name: String(name || 'phtml-plugin'),
			pluginFunction: pluginFunction instanceof Function
				? pluginFunction
			: () => {}
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

		await this.pluginFunction(pluginOptions)(result.root, result);

		return result;
	}
}

export default Plugin;
