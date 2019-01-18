import AttributeList from './AttributeList';
import Comment from './Comment';
import Container from './Container';
import Doctype from './Doctype';
import Element from './Element';
import Fragment from './Fragment';
import Node from './Node';
import NodeList from './NodeList';
import Plugin from './Plugin';
import Result from './Result';
import Text from './Text';

/**
* @name PostHTML
* @class
* @classdesc Create a new instance of {@link PostHTML}.
* @param {Array|Plugin|Function} plugins - Plugin or plugins being added.
* @return {PostHTML}
* @example
* new PostHTML(plugin)
* @example
* new PostHTML([ somePlugin, anotherPlugin ])
*/
class PostHTML {
	constructor (pluginOrPlugins) {
		Object.assign(this, { plugins: [] });

		this.use(pluginOrPlugins);
	}

	/**
	* Process input using plugins and return the result
	* @param {String} input - Source being processed.
	* @param {Object} processOptions - Custom settings applied to the Result.
	* @return {Result}
	* @example
	* posthtml.process('some html', processOptions)
	*/
	async process (input, processOptions) {
		const result = new Result(input, processOptions);

		if (this.plugins instanceof Array) {
			for (const plugin of this.plugins) {
				if (Object(plugin) instanceof Plugin) {
					await plugin()(result.root);
				} else if (plugin instanceof Function) {
					await plugin(result.root);
				}
			}
		}

		return result;
	}

	/**
	* Add plugins to the existing instance of PostHTML
	* @param {Array|Plugin|Function} plugins - Plugin or plugins being added.
	* @return {PostHTML}
	* @example
	* posthtml.use(plugin)
	* @example
	* posthtml.use([ somePlugin, anotherPlugin ])
	*/
	use (pluginOrPlugins) {
		const plugins = pluginOrPlugins instanceof Array
			? pluginOrPlugins.filter(
				plugin => plugin instanceof Plugin || plugin instanceof Function
			)
		: pluginOrPlugins instanceof Plugin || pluginOrPlugins instanceof Function
			? [pluginOrPlugins]
		: [];

		this.plugins.push(...plugins);

		return this;
	}

	/**
	* Process input and return the new {@link Result}
	* @param {Object} [processOptions] - Custom settings applied to the {@link Result}.
	* @param {Array|Plugin|Function} [plugins] - Custom settings applied to the {@link Result}.
	* @return {Result}
	* @example
	* PostHTML.process('some html', processOptions)
	* @example <caption>Process HTML with plugins.</caption>
	* PostHTML.process('some html', processOptions, plugins) // returns a new PostHTML instance
	*/
	static process (input, processOptions, pluginOrPlugins) {
		const posthtml = new PostHTML(pluginOrPlugins);

		return posthtml.process(input, processOptions);
	}

	/**
	* Return a new {@link PostHTML} instance which will use plugins
	* @param {Object} pluginOrPlugins - Plugin or plugins being added.
	* @return {PostHTML} - New {@link PostHTML} instance
	* @example
	* PostHTML.use(plugin) // returns a new PostHTML instance
	* @example
	* PostHTML.use([ somePlugin, anotherPlugin ]) // return a new PostHTML instance
	*/
	static use (pluginOrPlugins) {
		return new PostHTML(pluginOrPlugins);
	}

	static AttributeList = AttributeList;
	static Comment = Comment;
	static Container = Container;
	static Container = Container;
	static Doctype = Doctype;
	static Element = Element;
	static Fragment = Fragment;
	static Node = Node;
	static NodeList = NodeList;
	static Plugin = Plugin;
	static Result = Result;
	static Text = Text;
}

export default PostHTML;
