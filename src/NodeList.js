import Fragment from './Fragment';
import Text from './Text';
import normalize from './normalize';

// weak map of the parents of NodeLists
const parents = new WeakMap();

/**
* @name NodeList
* @class
* @extends Array
* @classdesc Create a new {@link NodeList}.
* @param {Container} parent - Parent containing the current {@link NodeList}.
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
	* Return the innerHTML of the current {@link Container} as a String.
	* @returns {String}
	* @example
	* container.innerHTML // returns a string of innerHTML
	*/
	get innerHTML () {
		return this.map(
			node => node.type === 'text'
				? getInnerHtmlEncodedString(node.data)
			: 'outerHTML' in node
				? node.outerHTML
			: String(node)
		).join('');
	}

	/**
	* Define the nodes of the current {@link NodeList} from a String.
	* @param {String} innerHTML - Source being processed.
	* @returns {Void}
	* @example
	* nodeList.innerHTML = 'Hello <strong>world</strong>';
	* nodeList.length; // 2
	*/
	set innerHTML (innerHTML) {
		const parent = this.parent;

		const Result = Object(parent.result).constructor

		if (Result) {
			const nodes = new Result(innerHTML).root.nodes;

			this.splice(0, this.length, ...nodes);
		}
	}

	/**
	* Return the parent of the current {@link NodeList}.
	* @returns {Container}
	*/
	get parent () {
		return parents.get(this);
	}

	/**
	* Return the text content of the current {@link NodeList} as a String.
	* @returns {String}
	*/
	get textContent () {
		return this.map(
			node => Object(node).textContent || ''
		).join('');
	}

	/**
	* Define the content of the current {@link NodeList} as a new {@link Text} {@link Node}.
	* @returns {String}
	*/
	set textContent (textContent) {
		this.splice(0, this.length, new Text({ data: textContent }));
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
		const parent = this.parent;
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
	splice (start, ...args) {
		const { length, parent } = this;
		const startIndex = start > length ? length : start < 0 ? Math.max(length + start, 0) : Number(start) || 0;
		const deleteCount = 0 in args ? Number(args[0]) || 0 : length;
		const inserts = getNodeListArray(args.slice(1).filter(node => node !== parent));

		for (let insert of inserts) {
			insert.remove();

			insert.parent = parent;
		}

		const removes = Array.prototype.splice.call(this, startIndex, deleteCount, ...inserts);

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
		const parent = this.parent;
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
		return Array.from(this).map(node => node.toJSON());
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
	return Object(nodes).length
		? Array.from(nodes).filter(
			node => node != null
		).map(normalize)
	: [];
}

/**
* Return an innerHTML-encoded string.
* @private
*/

function getInnerHtmlEncodedString (string) {
	return string.replace(
		/&|<|>/g,
		match => match === '&'
			? '&amp;'
		: match === '<'
			? '&lt;'
		: '&gt;'
	);
}
