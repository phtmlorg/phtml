/**
* Transform a {@link Node} and any descendants using visitors.
* @param {Node} node - The {@link Node} to be visited.
* @param {Result} result - The {@link Result} to be used by visitors.
* @param {Object} [overrideVisitors] - Alternative visitors to be used in place of {@link Result} visitors.
* @returns {ResultPromise}
* @private
*/

function visit (node, result, overrideVisitors) {
	// get visitors as an object
	const visitors = Object(overrideVisitors || Object(result).visitors);

	// get node types
	const beforeType = getTypeFromNode(node);
	const beforeSubType = getSubTypeFromNode(node);
	const beforeNodeType = 'Node';
	const beforeRootType = 'Root';
	const afterType = `after${beforeType}`;
	const afterSubType = `after${beforeSubType}`;
	const afterNodeType = 'afterNode';
	const afterRootType = 'afterRoot';

	let promise = Promise.resolve();

	// fire "before" visitors
	if (visitors[beforeNodeType]) {
		promise = promise.then(
			() => runAll(visitors[beforeNodeType], node, result)
		);
	}

	if (visitors[beforeType]) {
		promise = promise.then(
			() => runAll(visitors[beforeType], node, result)
		);
	}

	if (beforeSubType !== beforeType && visitors[beforeSubType]) {
		promise = promise.then(
			() => runAll(visitors[beforeSubType], node, result)
		);
	}

	// dispatch before root event
	if (visitors[beforeRootType] && node === result.root) {
		promise = promise.then(
			() => runAll(visitors[beforeRootType], node, result)
		);
	}

	// walk children
	if (Array.isArray(node.nodes)) {
		node.nodes.slice(0).forEach(childNode => {
			promise = promise.then(
				() => (
					childNode.parent === node &&
					visit(childNode, result, overrideVisitors)
				)
			);
		})
	}

	// fire "after" visitors
	if (visitors[afterNodeType]) {
		promise = promise.then(
			() => runAll(visitors[afterNodeType], node, result)
		);
	}

	if (visitors[afterType]) {
		promise = promise.then(
			() => runAll(visitors[afterType], node, result)
		);
	}

	if (afterType !== afterSubType && visitors[afterSubType]) {
		promise = promise.then(
			() => runAll(visitors[afterSubType], node, result)
		);
	}

	// dispatch root event
	if (visitors[afterRootType] && node === result.root) {
		promise = promise.then(
			() => runAll(visitors[afterRootType], node, result)
		);
	}

	return promise.then(
		() => result
	);
}

export function runAll (plugins, node, result) {
	let promise = Promise.resolve();

	[].concat(plugins || []).forEach(plugin => {
		// run the current plugin
		promise = promise.then(() => {
			// update the current plugin
			result.currentPlugin = plugin;

			return plugin(node, result);
		}).then(() => {
			// clear the current plugin
			result.currentPlugin = null;
		});
	});

	return promise;
}

// return normalized plugins and visitors
function getVisitors (rawplugins) {
	const visitors = {};

	// initialize plugins and visitors
	[].concat(rawplugins || []).forEach(plugin => {
		const initializedPlugin = Object(plugin).type === 'plugin' ? plugin() : plugin;

		if (initializedPlugin instanceof Function) {
			if (!visitors.afterRoot) {
				visitors.afterRoot = [];
			}

			visitors.afterRoot.push(initializedPlugin);
		} else if (Object(initializedPlugin) === initializedPlugin && Object.keys(initializedPlugin).length) {
			Object.keys(initializedPlugin).forEach(key => {
				const fn = initializedPlugin[key];

				if (fn instanceof Function) {
					if (!visitors[key]) {
						visitors[key] = [];
					}

					visitors[key].push(initializedPlugin[key]);
				}
			});
		}
	});

	return visitors;
}

function getTypeFromNode (node) {
	return {
		'comment': 'Comment',
		'text': 'Text',
		'doctype': 'Doctype',
		'fragment': 'Fragment'
	}[node.type] || 'Element';
}

function getSubTypeFromNode (node) {
	return {
		'comment': 'Comment',
		'text': 'Text',
		'doctype': 'Doctype',
		'fragment': 'Fragment'
	}[node.type] || (
		!node.name
			? 'FragmentElement'
		: `${node.name[0].toUpperCase()}${node.name.slice(1)}Element`
	);
}

export {
	visit as default,
	getVisitors
};
