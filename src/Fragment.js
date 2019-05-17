import Container from './Container';
import NodeList from './NodeList';

/**
* @name Fragment
* @class
* @extends Container
* @classdesc Create a new {@link Fragment} {@Link Node}.
* @param {Object} settings - Custom settings applied to the {@link Fragment}.
* @param {Array|NodeList} settings.nodes - Nodes appended to the {@link Fragment}.
* @param {Object} settings.source - Source mapping of the {@link Fragment}.
* @returns {Fragment}
* @example
* new Fragment() // returns an empty fragment
*
* new Fragment({ nodes: [ new Element('span') ] }) // returns a fragment with a <span>
*/

class Fragment extends Container {
	constructor (settings) {
		super();

		Object.assign(this, settings, {
			type: 'fragment',
			name: '#document-fragment',
			nodes: Array.isArray(Object(settings).nodes)
				? new NodeList(this, ...Array.from(settings.nodes))
			: Object(settings).nodes !== null && Object(settings).nodes !== undefined
				? new NodeList(this, settings.nodes)
			: new NodeList(this),
			source: Object(Object(settings).source)
		});
	}

	/**
	* Return a clone of the current {@link Fragment}.
	* @param {Boolean} isDeep - Whether the descendants of the current Fragment should also be cloned.
	* @returns {Fragment} - The cloned Fragment
	*/
	clone (isDeep) {
		const clone = new Fragment({ ...this, nodes: [] });

		if (isDeep) {
			clone.nodes = this.nodes.clone(clone);
		}

		return clone;
	}

	/**
	* Return the current {@link Fragment} as an Array.
	* @returns {Array}
	* @example
	* fragment.toJSON() // returns []
	*/
	toJSON () {
		return this.nodes.toJSON();
	}

	/**
	* Return the current {@link Fragment} as a String.
	* @returns {String}
	* @example
	* fragment.toJSON() // returns ''
	*/
	toString () {
		return String(this.nodes);
	}
}

export default Fragment;
