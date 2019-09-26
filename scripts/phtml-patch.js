const { Element, Plugin } = require('phtml');

module.exports = new Plugin('phtml-patch', () => ({
	HeadElement ($head) {
		$head.append(
			new Element({
				name: 'link',
				attrs: {
					rel: 'shortcut icon',
					type: 'image/x-icon',
					href: 'https://phtml.io/favicon.ico'
				},
				isVoid: true
			})
		);
	},
	H3Element ($h3) {
		if (
			$h3.textContent === 'Global'
		) {
			$h3.next.remove();
			$h3.remove();
		}
	},
	AElement ($a) {
		if (
			$a.attrs.contains({ href: 'index.html' }) &&
			$a.parent.name === 'h2' &&
			$a.nodes[0]
		) {
			$a.attrs.add({ href: './' });
			$a.nodes[0].data = 'pHTML';
		} else if (
			$a.attrs.contains({ href: 'https://github.com/phtmlorg/phtml' }) &&
			$a.parent.name === 'h2'
		) {
			const $linkBody = [
				new Element({
					name: 'h3',
					nodes: [
						'Links'
					]
				}),
				new Element({
					name: 'ul',
					nodes: [
						new Element({
							name: 'li',
							nodes: [
								$a.clone(null, true)
							]
						})
					]
				})
			];

			const $nav = $a.parent.parent;

			$a.remove();

			$nav.append(...$linkBody);
		}
	}
}));
