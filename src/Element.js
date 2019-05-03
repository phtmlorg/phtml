import AttributeList from './AttributeList';
import Container from './Container';
import NodeList from './NodeList';
import Result from './Result';

/**
* @name Element
* @class
* @extends Container
* @classdesc Create a new {@link Element} {@Link Node}.
* @param {Object|String} settings - Custom settings applied to the {@link Element}, or the tag name of the {@link Text}.
* @param {String} settings.name - Tag name of the {@link Element}.
* @param {Boolean} settings.isSelfClosing - Whether the {@link Element} is self-closing.
* @param {Boolean} settings.isVoid - Whether the {@link Element} is void.
* @param {Boolean} settings.isisWithoutEndTagVoid - Whether the {@link Element} uses a closing tag.
* @param {Array|AttributeList|Object} settings.attrs - Attributes applied to the {@link Element}.
* @param {Array|NodeList} settings.nodes - Nodes appended to the {@link Element}.
* @param {Object} settings.source - Source mapping of the {@link Element}.
* @returns {Element} A new {@link Element} {@Link Node}
* @example
* new Element({ name: 'p' }) // returns an element representing <p></p>
*
* new Element({
*   name: 'input',
*   attrs: [{ name: 'type', value: 'search' }],
*   isVoid: true
* }) // returns an element representing <input type="search">
*/
class Element extends Container {
	constructor (settings) {
		super();

		if (typeof settings === 'string') {
			settings = { name: settings };
		}

		const name = String('name' in Object(settings) ? settings.name : 'span');

		Object.assign(this, settings, {
			type: 'element',
			name,
			isSelfClosing: Boolean(Object(settings).isSelfClosing),
			isVoid: 'isVoid' in Object(settings)
				? Boolean(Object(settings).isVoid)
			: Result.voidElements.includes(name),
			isWithoutEndTag: Boolean(Object(settings).isWithoutEndTag),
			attrs: AttributeList.from(Object(settings).attrs),
			nodes: Array.isArray(Object(settings).nodes)
				? new NodeList(this, ...Array.from(settings.nodes))
			: Object(settings).nodes !== null && Object(settings).nodes !== undefined
				? new NodeList(this, settings.nodes)
			: new NodeList(this),
			source: Object(Object(settings).source)
		});
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
		const clone = new Element({ ...this, nodes: [], ...Object(settings) });
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
