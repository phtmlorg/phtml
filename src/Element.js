import AttributeList from './AttributeList';
import Container from './Container';
import NodeList from './NodeList';
import Result from './Result';

/**
* @name Element
* @class
* @extends Container
* @classdesc Create a new {@link Element} {@Link Node}.
* @param {Object|String} settings - Custom settings applied to the {@link Element} or its tag name.
* @param {String} settings.name - Tag name of the {@link Element}.
* @param {Boolean} settings.isSelfClosing - Whether the {@link Element} is self-closing.
* @param {Boolean} settings.isVoid - Whether the {@link Element} is void.
* @param {Boolean} settings.isWithoutEndTag - Whether the {@link Element} uses a closing tag.
* @param {Array|AttributeList|Object} settings.attrs - Attributes applied to the {@link Element}.
* @param {Array|NodeList} settings.nodes - Nodes appended to the {@link Element}.
* @param {Object} settings.source - Source mapping of the {@link Element}.
* @param {Array|AttributeList|Object} [attrs] - Conditional override attributes applied to the {@link Element}.
* @param {Array|NodeList} [nodes] - Conditional override nodes appended to the {@link Element}.
* @returns {Element} A new {@link Element} {@Link Node}
* @example
* new Element({ name: 'p' }) // returns an element representing <p></p>
*
* new Element({
*   name: 'input',
*   attrs: [{ name: 'type', value: 'search' }],
*   isVoid: true
* }) // returns an element representing <input type="search">
* @example
* new Element('p') // returns an element representing <p></p>
*
* new Element('p', null,
*   new Element(
*     'input',
*     [{ name: 'type', value: 'search' }]
*   )
* ) // returns an element representing <p><input type="search"></p>
*/
class Element extends Container {
	constructor (settings, ...args) {
		super();

		if (settings !== Object(settings)) {
			settings = { name: String(settings == null ? 'span' : settings) };
		}

		if (args[0] === Object(args[0])) {
			settings.attrs = args[0];
		}

		if (args.length > 1) {
			settings.nodes = args.slice(1);
		}

		Object.assign(this, settings, {
			type: 'element',
			name: settings.name,
			isSelfClosing: Boolean(settings.isSelfClosing),
			isVoid: 'isVoid' in settings
				? Boolean(settings.isVoid)
			: Result.voidElements.includes(settings.name),
			isWithoutEndTag: Boolean(settings.isWithoutEndTag),
			attrs: AttributeList.from(settings.attrs),
			nodes: Array.isArray(settings.nodes)
				? new NodeList(this, ...Array.from(settings.nodes))
			: settings.nodes !== null && settings.nodes !== undefined
				? new NodeList(this, settings.nodes)
			: new NodeList(this),
			source: Object(settings.source)
		})
	}

	/**
	* Return the outerHTML of the current {@link Element} as a String.
	* @returns {String}
	* @example
	* element.outerHTML // returns a string of outerHTML
	*/
	get outerHTML () {
		return `${getOpeningTagString(this)}${this.nodes.innerHTML}${getClosingTagString(this)}`;
	}

	/**
	* Replace the current {@link Element} from a String.
	* @param {String} input - Source being processed.
	* @returns {Void}
	* @example
	* element.outerHTML = 'Hello <strong>world</strong>';
	*/
	set outerHTML (outerHTML) {
		Object.getOwnPropertyDescriptor(Container.prototype, 'outerHTML').set.call(this, outerHTML);
	}

	/**
	* Return a clone of the current {@link Element}.
	* @param {Object} settings - Custom settings applied to the cloned {@link Element}.
	* @param {Boolean} isDeep - Whether the descendants of the current {@link Element} should also be cloned.
	* @returns {Element} - The cloned Element
	*/
	clone (settings, isDeep) {
		const clone = new Element({
			...this,
			nodes: [],
			...Object(settings)
		});

		const didSetNodes = 'nodes' in Object(settings);

		if (isDeep && !didSetNodes) {
			clone.nodes = this.nodes.clone(clone);
		}

		return clone;
	}

	/**
	* Return the Element as a unique Object.
	* @returns {Object}
	*/
	toJSON () {
		const object = { name: this.name };

		// conditionally disclose whether the Element is self-closing
		if (this.isSelfClosing) {
			object.isSelfClosing = true;
		}

		// conditionally disclose whether the Element is void
		if (this.isVoid) {
			object.isVoid = true;
		}

		// conditionally disclose Attributes applied to the Element
		if (this.attrs.length) {
			object.attrs = this.attrs.toJSON();
		}

		// conditionally disclose Nodes appended to the Element
		if (!this.isSelfClosing && !this.isVoid && this.nodes.length) {
			object.nodes = this.nodes.toJSON();
		}

		return object;
	}

	/**
	* Return the stringified Element.
	* @returns {String}
	*/
	toString () {
		return `${getOpeningTagString(this)}${this.nodes || ''}${
			`${getClosingTagString(this)}`
		}`;
	}
}

export default Element;

function getClosingTagString (element) {
	return element.isSelfClosing || element.isVoid || element.isWithoutEndTag
		? ''
	: `</${element.name}${element.source.after || ''}>`;
}

function getOpeningTagString (element) {
	return `<${element.name}${element.attrs}${element.source.before || ''}>`;
}
