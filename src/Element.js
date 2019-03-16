import AttributeList from './AttributeList';
import Container from './Container';
import NodeList from './NodeList';

/**
* @name Element
* @class
* @extends Container
* @classdesc Create a new {@link Element} {@Link Node}.
* @param {Object} settings - Custom settings applied to the {@link Element}.
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

		Object.assign(this, settings, {
			type: 'element',
			name: String('name' in Object(settings) ? settings.name : 'span'),
			isSelfClosing: Boolean(Object(settings).isSelfClosing),
			isVoid: Boolean(Object(settings).isVoid),
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
	* Return a clone of the current {@link Container}.
	* @param {Object} settings - Custom settings applied to the cloned {@link Container}.
	* @param {Boolean} isDeep - Whether the descendants of the current Container should also be cloned.
	* @returns {Container} - The cloned Container
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
		return `<${this.name}${this.attrs}${this.source.before || ''}>${this.nodes || ''}${
			this.isSelfClosing || this.isVoid || this.isWithoutEndTag
				? ''
			: `</${this.name}${this.source.after || ''}>`
		}`;
	}
}

export default Element;
