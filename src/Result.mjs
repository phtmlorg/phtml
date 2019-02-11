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
		const warnings = [];

		Object.assign(this, {
			type: 'result',
			from,
			to,
			root,
			warnings
		});
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

	/**
	* Add a warning to the current {@link Root}.
	* @param {String} text - The message being sent as the warning.
	* @param {Object} [opts] - Additional information about the warning.
	* @example
	* result.warn('Something went wrong')
	* @example
	* result.warn('Something went wrong', {
	*   node: someNode,
	*   plugin: somePlugin
	* })
	*/
	warn (text, rawopts) {
		const opts = Object(rawopts);

		if (!opts.plugin) {
			if (Object(this.currentPlugin).name) {
				opts.plugin = this.currentPlugin.name
			}
		}

		this.warnings.push({ text, opts });
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
				source: node.sourceCodeLocation
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

					return { ...attr, source: { input, from, source } };
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
		const $node = new Comment({
			comment: node.text,
			source: { input, from, ...node.sourceCodeLocation }
		});

		addNode($node);
	});

	// when the parser encounters text content
	parser.on('text', onText);

	// process the input
	parser.end(input);

	// add any remaining elements in the stack to the root
	while (stack.length) {
		addElement();
	}

	return root;

	// whenever a text node that needs additional parsing is encountered
	function onText (node) {
		// get node text as raw content
		const data = input.slice(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset);

		const jsxSRegExp = /<>/;
		const jsxERegExp = /<\/>/;

		const isOpeningJSX = jsxSRegExp.test(data);
		const isClosingJSX = jsxERegExp.test(data);

		if (isOpeningJSX) {
			// handle opening JSX Fragment Elements
			const jsxOuterOffset = data.search(jsxSRegExp);
			const jsxInnerOffset = jsxOuterOffset + 2;

			// add the preceeding text node
			const $text = new Text({
				data: data.slice(0, jsxOuterOffset),
				source: {
					input,
					from,
					...node.sourceCodeLocation,
					endOffset: node.sourceCodeLocation.startOffset + jsxOuterOffset
				}
			});

			addNode($text);

			// add the JSX Fragment Element
			const $element = new Element({
				name: '',
				attrs: [],
				isSelfClosing: false,
				isVoid: false,
				source: {
					input,
					from,
					startInnerOffset: node.sourceCodeLocation.startOffset + jsxInnerOffset,
					startOffset: node.sourceCodeLocation.startOffset + jsxOuterOffset
				}
			});

			stack.push($element);

			// continue processing the proceeding text node
			onText({
				sourceCodeLocation: {
					...node.sourceCodeLocation,
					startOffset: node.sourceCodeLocation.startOffset + jsxInnerOffset
				}
			});
		} else if (isClosingJSX) {
			// handle closing JSX Fragment Elements
			const jsxInnerOffset = data.search(jsxERegExp);
			const jsxOuterOffset = jsxInnerOffset + 3;

			const $text = new Text({
				data: data.slice(0, jsxInnerOffset),
				source: {
					input,
					from,
					...node.sourceCodeLocation,
					endOffset: node.sourceCodeLocation.startOffset + jsxInnerOffset
				}
			});

			addNode($text);

			addElement({
				sourceCodeLocation: {
					startOffset: node.sourceCodeLocation.startOffset + jsxInnerOffset,
					endOffset: node.sourceCodeLocation.startOffset + jsxOuterOffset
				}
			});

			onText({
				sourceCodeLocation: {
					...node.sourceCodeLocation,
					startOffset: node.sourceCodeLocation.startOffset + jsxOuterOffset
				}
			});
		} else {
			const $text = new Text({
				data,
				source: { input, from, ...node.sourceCodeLocation }
			});

			addNode($text);
		}
	}

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

			// Change JSX Fragment Elements to work like <script> and <style>
			if ($element.name === '') {
				$element.nodes.splice(0, $element.nodes.length, new Text({
					data: $element.sourceInnerHTML,
					source: {
						input,
						from,
						startOffset: $element.source.startInnerOffset,
						endOffset: $element.source.endInnerOffset
					}
				}));
			}
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
