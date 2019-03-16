import Comment from './Comment';
import Doctype from './Doctype';
import Element from './Element';
import Fragment from './Fragment';
import Node from './Node';
import Text from './Text';

export default function normalize (node) {
	const nodeTypes = {
		comment: Comment,
		doctype: Doctype,
		element: Element,
		fragment: Fragment,
		text: Text
	};

	return node instanceof Node
		// Nodes are unchanged
		? node
	: node.type in nodeTypes
		// Strings are converted into Text nodes
		? new nodeTypes[node.type](node)
	// Node-like Objects with recognized types are normalized
	: new Text({ data: String(node) })
}
