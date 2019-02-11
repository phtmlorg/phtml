/**
* @name Node
* @class
* @extends Node
* @classdesc Create a new {@link Node}.
* @return {Node}
*/
class Node {
	/**
	* Insert one ore more {@link Node}s after the current {@link Node}.
	* @returns {Node} - Current Node.
	* @example
	* node.after(new Text({ data: 'Hello World' }))
	*/
	after (...nodes) {
		if (nodes.length) {
			const index = this.index;

			if (index !== -1) {
				this.parent.nodes.splice(index + 1, 0, ...nodes);
			}
		}

		return this;
	}

	/**
	* Append Nodes or new Text Nodes to the Node.
	* @param {...Array} nodes - Nodes inserted after the last child of the Element.
	* @returns {Node} - Current Node.
	*/
	append (...nodes) {
		if (this.nodes) {
			this.nodes.splice(this.nodes.length, 0, ...nodes);
		}

		return this;
	}

	/**
	* Append the current {@link Node} to another Node.
	* @returns {Node} - Current Node.
	*/
	appendTo (parent) {
		if (parent && parent.nodes) {
			parent.nodes.splice(parent.nodes.length, 0, this);
		}

		return this;
	}

	/**
	* Insert Nodes or new Text Nodes before the Node if it has a parent.
	* @returns {Node}
	* @example
	* node.before(new Text({ data: 'Hello World' })) // returns the current node
	*/
	before (...nodes) {
		if (nodes.length) {
			const index = this.index;

			if (index !== -1) {
				this.parent.nodes.splice(index, 0, ...nodes);
			}
		}

		return this;
	}

	/**
	* Return the next {@link Node} after the current {@link Node}, or `null` if there is none.
	* @returns {Node|Null} - Next Node or null.
	* @example
	* node.next // returns null
	*/
	get next () {
		const index = this.index;

		if (index !== -1) {
			return this.parent.nodes[index + 1] || null;
		}

		return null;
	}

	/**
	* Return the next {@link Element} after the current {@link Node}, or `null` if there is none.
	* @returns {Element|Null}
	* @example
	* node.nextElement // returns an element or null
	*/
	get nextElement () {
		const index = this.index;

		if (index !== -1) {
			return this.parent.nodes.slice(index).find(hasNodes);
		}

		return null;
	}

	/**
	* Return the previous {@link Node} before the current {@link Node}, or `null` if there is none.
	* @returns {Node|Null}
	* @example
	* node.previous // returns a node or null
	*/
	get previous () {
		const index = this.index;

		if (index !== -1) {
			return this.parent.nodes[index - 1] || null;
		}

		return null;
	}

	/**
	* Return the previous {@link Element} before the current {@link Node}, or `null` if there is none.
	* @returns {Element|Null}
	* @example
	* node.previousElement // returns an element or null
	*/
	get previousElement () {
		const index = this.index;

		if (index !== -1) {
			return this.parent.nodes.slice(0, index).reverse().find(hasNodes);
		}

		return null;
	}

	/**
	* Remove the current {@link Node} from its parent.
	* @returns {Node}
	* @example
	* node.remove() // returns the current node
	*/
	remove () {
		const index = this.index;

		if (index !== -1) {
			this.parent.nodes.splice(index, 1);
		}

		return this;
	}

	/**
	* Replace the current {@link Node} with another Node or Nodes.
	* @param {...Array} nodes - Nodes replacing the current {@link Node}.
	* @returns {Node} - The current {@link Node}
	* @example
	* node.replaceWith(someOtherNode) // returns the current node
	*/
	replaceWith (...nodes) {
		const index = this.index;

		if (index !== -1) {
			this.parent.nodes.splice(index, 1, ...nodes);
		}

		return this;
	}

	/**
	* Add a warning from the current {@link Node}.
	* @param {Result} result - The {@link Result} the warning is being added to.
	* @param {String} text - The message being sent as the warning.
	* @param {Object} [opts] - Additional information about the warning.
	* @example
	* node.warn(result, 'Something went wrong')
	* @example
	* node.warn(result, 'Something went wrong', {
	*   node: someOtherNode,
	*   plugin: someOtherPlugin
	* })
	*/
	warn (result, text, opts) {
		const data = Object.assign({ node: this }, opts);

		return result.warn(text, data);
	}

	/**
	* The position of the current {@link Node} from its parent.
	* @returns {Number}
	* @example
	* node.index // returns the index of the node or -1
	*/
	get index () {
		if (this.parent === Object(this.parent) && this.parent.nodes && this.parent.nodes.length) {
			return this.parent.nodes.indexOf(this);
		}

		return -1;
	}

	/**
	* The top-most ancestor from the current {@link Node}.
	* @returns {Node}
	* @example
	* node.root // returns the top-most node or the current node itself
	*/
	get root () {
		let parent = this;

		while (parent.parent) {
			parent = parent.parent;
		}

		return parent;
	}
}

function hasNodes (node) {
	return node.nodes;
}

export default Node;
