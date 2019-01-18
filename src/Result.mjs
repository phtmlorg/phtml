import SAXParser from 'parse5-sax-parser';
import Comment from './Comment';
import Doctype from './Doctype';
import Element from './Element';
import Fragment from './Fragment';
import Text from './Text';

/**
* @name Result
* @class
* @classdesc Create a new syntax tree {@link Result} from a processed input.
* @param {Object} processOptions - Custom settings applied to the {@link Result}.
* @param {String} processOptions.from - Source input location.
* @param {String} processOptions.to - Destination output location.
* @param {Array} processOptions.voidElements - Void elements.
* @return {Result}
*/
class Result {
	constructor (input, processOptions) {
		const from = 'from' in Object(processOptions)
			? String(processOptions.from || '')
		: null;
		const to = 'to' in Object(processOptions) ? String(processOptions.to || from) : from;
		const voidElements = 'voidElements' in Object(processOptions)
			? Array.from(voidElements)
		: defaultVoidElements;
		const root = parse(input, { from, to, voidElements });

		Object.assign(this, { from, to, root });
	}

	/**
	* Return the current {@link Root} as a String.
	* @returns {String}
	*/
	get html () {
		return String(this.root);
	}

	/**
	* Return the current {@link Root} as an Object.
	* @returns {Object}
	*/
	toJSON () {
		return this.root.toJSON();
	}
}

function parse (input, result) {
	const parser = new SAXParser({ sourceCodeLocationInfo: true });
	const originalLeaveAttrName = parser.tokenizer._leaveAttrName;
	parser.tokenizer._leaveAttrName = function _leaveAttrName(toState) {
		const isDuplicateAttr = this.currentToken.attrs.some(attr => attr.name === this.currentAttr.name && attr.value === this.currentAttr.value);

		if (isDuplicateAttr) {
			this.currentToken.attrs.push(this.currentAttr);
		}

		originalLeaveAttrName.call(this, toState);
	};
	const originalLeaveAttrValue = parser.tokenizer._leaveAttrValue;
	parser.tokenizer._leaveAttrValue = function _leaveAttrValue(toState) {
		const isDuplicateAttr = this.currentToken.attrs.some(attr => attr.name === this.currentAttr.name && attr.value !== this.currentAttr.value);

		if (isDuplicateAttr) {
			this.currentToken.attrs.push(this.currentAttr);
		}

		originalLeaveAttrValue.call(this, toState);
	}

	const stack = [];
	const root = new Fragment();
	const { from, voidElements } = result;

	// when the parser encounters a document type declaration
	parser.on('doctype', node => {
		root.nodes.push(
			new Doctype({
				publicId: node.publicId,
				systemId: node.systemId,
				source: node.sourceCodeLocation,
			})
		);
	});

	// when the parser encounters an start tag
	parser.on('startTag', node => {
		const $element = new Element({
			name: node.tagName,
			attrs: node.attrs.map(
				attr => {
					const source = node.sourceCodeLocation.attrs[attr.name];

					return Object.assign({}, attr, { source: { input, from, source } })
				}
			),
			isSelfClosing: node.selfClosing,
			isVoid: voidElements.includes(node.tagName),
			source: { input, from }
		});

		if ($element.isSelfClosing || $element.isVoid) {
			addNode($element);
		} else {
			stack.push($element);
		}

		setStartSource($element, node.sourceCodeLocation);
	});

	// when the parser encounters an end tag
	parser.on('endTag', addElement);

	// when the parser encounters a comment
	parser.on('comment', node => {
		const $text = new Comment({
			comment: node.text,
			source: Object.assign({ input, from }, node.sourceCodeLocation)
		});

		addNode($text);
	});

	// when the parser encounters text content
	parser.on('text', node => {
		const $text = new Text({
			data: node.text,
			source: Object.assign({ input, from }, node.sourceCodeLocation)
		});

		addNode($text);
	});

	// process the input
	parser.end(input);

	// add any remaining elements in the stack to the root
	while (stack.length) {
		addElement();
	}

	return root;

	// add remaining elements in the stack to the root
	function addElement (node) {
		const $element = stack.pop();

		if (!stack.length) {
			root.nodes.push($element);
		} else {
			addNode($element);
		}

		if (node) {
			setEndSource($element, node.sourceCodeLocation);
		}
	}

	// add a node to the root or to the last node
	function addNode (node) {
		const last = stack[stack.length - 1];

		if (!last) {
			root.nodes.push(node);
		} else {
			last.nodes.push(node);
		}
	}
}

function setStartSource ($element, source) {
	if ($element.isSelfClosing || $element.isVoid) {
		Object.assign($element.source, source);
	} else {
		Object.assign($element.source, {
			startLine: source.startLine,
			startCol: source.startCol,
			startOffset: source.startOffset,
			startInnerLine: source.endLine,
			startInnerCol: source.endCol,
			startInnerOffset: source.endOffset
		});
	}
}

function setEndSource ($element, source) {
	Object.assign($element.source, {
		endLine: source.endLine,
		endCol: source.endCol,
		endOffset: source.endOffset,
		endInnerLine: source.startLine,
		endInnerCol: source.startCol,
		endInnerOffset: source.startOffset
	});
}

const defaultVoidElements = [
	'area',
	'base',
	'br',
	'col',
	'command',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr'
];

export default Result;
