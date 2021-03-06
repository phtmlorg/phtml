import Node from './Node';

/**
* @name Comment
* @class
* @extends Node
* @classdesc Return a new {@link Comment} {@link Node}.
* @param {Object|String} settings - Custom settings applied to the Comment, or the content of the {@link Comment}.
* @param {String} settings.comment - Content of the Comment.
* @param {Object} settings.source - Source mapping of the Comment.
* @returns {Comment}
* @example
* new Comment({ comment: ' Hello World ' })
*/
class Comment extends Node {
	constructor (settings) {
		super();

		if (typeof settings === 'string') {
			settings = { comment: settings };
		}

		Object.assign(this, {
			type: 'comment',
			name: '#comment',
			comment: String(Object(settings).comment || ''),
			source: Object(Object(settings).source)
		});
	}

	/**
	* Return the stringified innerHTML of the current {@link Comment}.
	* @returns {String}
	* @example
	* attrs.innerHTML // returns ' Hello World '
	*/
	get innerHTML () {
		return String(this.comment);
	}

	/**
	* Return the stringified outerHTML of the current {@link Comment}.
	* @returns {String}
	* @example
	* attrs.outerHTML // returns '<!-- Hello World -->'
	*/
	get outerHTML () {
		return String(this);
	}

	/**
	* Return the stringified innerHTML from the source input.
	* @returns {String}
	* @example
	* attrs.sourceInnerHTML // returns ' Hello World '
	*/
	get sourceInnerHTML () {
		return typeof Object(this.source.input).html !== 'string'
			? ''
		: this.source.input.html.slice(
			this.source.startOffset + 4,
			this.source.endOffset - 3
		);
	}

	/**
	* Return the stringified outerHTML from the source input.
	* @returns {String}
	* @example
	* attrs.sourceOuterHTML // returns '<!-- Hello World -->'
	*/
	get sourceOuterHTML () {
		return typeof Object(this.source.input).html !== 'string'
			? ''
		: this.source.input.html.slice(
			this.source.startOffset,
			this.source.endOffset
		);
	}

	/**
	* Return a clone of the current {@link Comment}.
	* @param {Object} settings - Custom settings applied to the cloned {@link Comment}.
	* @returns {Comment} - The cloned {@link Comment}
	* @example
	* comment.clone()
	* @example <caption>Clone the current text with new source.</caption>
	* comment.clone({ source: { input: 'modified source' } })
	*/
	clone (settings) {
		return new this.constructor(Object.assign({}, this, settings, {
			source: Object.assign({}, this.source, Object(settings).source)
		}));
	}

	/**
	* Return the current {@link Comment} as a String.
	* @returns {String} A string version of the current {@link Comment}
	* @example
	* attrs.toJSON() // returns '<!-- Hello World -->'
	*/
	toString () {
		return `<!--${this.comment}-->`;
	}

	/**
	* Return the current {@link Comment} as a Object.
	* @returns {Object} An object version of the current {@link Comment}
	* @example
	* attrs.toJSON() // returns { comment: ' Hello World ' }
	*/
	toJSON () {
		return {
			comment: this.comment
		};
	}
}

export default Comment;
