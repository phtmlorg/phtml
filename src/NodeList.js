import Fragment from './Fragment';
import normalize from './normalize';

// weak map of the parents of NodeLists
const parents = new WeakMap();

/**
* @name NodeList
* @class
* @extends Array
* @classdesc Create a new {@link NodeList}.
* @param {Object} parent - Parent containing the current {@link NodeList}.
* @param {...Node} nodes - {@link Node}s belonging to the current {@link NodeList}.
* @returns {NodeList}
*/
class NodeList extends Array {
	constructor (parent, ...nodes) {
		super();

		parents.set(this, parent);

		if (nodes.length) {
			this.push(...nodes);
		}
	}

	/**
	* Return a clone of the current {@link NodeList}.
	* @param {Object} parent - New parent containing the cloned {@link NodeList}.
	* @returns {NodeList} - The cloned NodeList
	*/
	clone (parent) {
		return new NodeList(parent, ...this.map(node => node.clone({}, true)));
	}

	/**
	* Remove and return the last {@link Node} in the {@link NodeList}.
	* @returns {Node}
	*/
	pop () {
		const [ remove ] = this.splice(this.length - 1, 1);

		return remove;
	}

	/**
	* Add {@link Node}s to the end of the {@link NodeList} and return the new length of the {@link NodeList}.
	* @returns {Number}
	*/
	push (...nodes) {
		const parent = parents.get(this);
		const inserts = nodes.filter(node => node !== parent);

		this.splice(this.length, 0, ...inserts);

		return this.length;
	}

	/**
	* Remove and return the first {@link Node} in the {@link NodeList}.
	* @returns {Node}
	*/
	shift () {
		const [ remove ] = this.splice(0, 1);

		return remove;
	}

	/**
	* Add and remove {@link Node}s to and from the {@link NodeList}.
	* @returns {Array}
	*/
	splice (start, ...opts) {
		const parent = parents.get(this);
		const deleteCount = opts.length ? opts[0] : this.length - start;
		const inserts = getNodeListArray(opts.slice(1).filter(node => node !== parent));

		for (let insert of inserts) {
			insert.remove();

			insert.parent = parent;
		}

		const removes = Array.prototype.splice.call(this, start, deleteCount, ...inserts);

		for (let remove of removes) {
			delete remove.parent;
		}

		return removes;
	}

	/**
	* Add {@link Node}s to the beginning of the {@link NodeList} and return the new length of the {@link NodeList}.
	* @returns {Number}
	*/
	unshift (...nodes) {
		const parent = parents.get(this);
		const inserts = nodes.filter(node => node !== parent);

		this.splice(0, 0, ...inserts);

		return this.length;
	}

	/**
	* Return the current {@link NodeList} as a String.
	* @returns {String}
	* @example
	* nodeList.toString() // returns ''
	*/
	toString () {
		return this.join('');
	}

	/**
	* Return the current {@link NodeList} as an Array.
	* @returns {Array}
	* @example
	* nodeList.toJSON() // returns []
	*/
	toJSON () {
		return this.map(node => node.toJSON());
	}

	/**
	* Return a new {@link NodeList} from an object.
	* @param {Array|Node} nodes - An array or object of nodes.
	* @returns {NodeList} A new {@link NodeList}
	* @example <caption>Return a NodeList from an array of text.</caption>
	* NodeList.from([ 'test' ]) // returns NodeList [ Text { data: 'test' } ]
	*/

	static from (nodes) {
		return new NodeList(new Fragment(), ...getNodeListArray(nodes));
	}
}

export default NodeList;

/**
* Return an NodeList-compatible array from an array.
* @private
*/

function getNodeListArray (nodes) {
	// coerce nodes into an array
	return [].concat(nodes !== null && nodes !== undefined ? nodes : []).filter(
		node => node !== null && node !== undefined
	).map(normalize);
}
