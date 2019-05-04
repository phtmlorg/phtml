const PHTML = require('..');
const test = require('./test');

const { Comment, Element, Fragment, Node, NodeList, Plugin, Result, Text } = PHTML;

async function tests() {
	const processOptions = { from: 'test.html' };
	const html = `<section>
	<h1>Hello World</h1>
	<p class="foo" bar-qux="lorem" />
</section><section>
	<h1>Hello World</h1>
	<p class="foo" bar-qux="lorem" />
</section><section>
	<h1>Hello World</h1>
	<p class="foo" bar-qux="lorem" />
</section>`;

	const fragment = (new Result(html, processOptions)).root;

	/* Test Container
	/* ====================================================================== */

	await test('Container#append is a Function', () => fragment.append instanceof Function);
	await test('Container#replaceAll is a Function', () => fragment.replaceAll instanceof Function);
	await test('Container#first is a Node', () => fragment.first instanceof Node);
	await test('Container#firstElement is an Element', () => fragment.firstElement instanceof Element);
	await test('Container#last is a Node', () => fragment.last instanceof Node);
	await test('Container#lastElement is an Element', () => fragment.lastElement instanceof Element);
	await test('Container#nth is a Function', () => fragment.nth instanceof Function);
	await test('Container#lastNth is a Function', () => fragment.lastNth instanceof Function);
	await test('Container#nthElement is a Function', () => fragment.nthElement instanceof Function);
	await test('Container#lastNthElement is a Function', () => fragment.lastNthElement instanceof Function);
	await test('Container#walk is a Function', () => fragment.walk instanceof Function);
	await test('Node#before is a Function', () => fragment.before instanceof Function);
	await test('Node#after is a Function', () => fragment.after instanceof Function);
	await test('Container#nodes is a NodeList', () => fragment.nodes instanceof NodeList);
	await test('Container#nodes is an Array', () => fragment.nodes instanceof Array);
	await test('Container#elements is a NodeList', () => fragment.elements instanceof NodeList);
	await test('Container#elements is an Array', () => fragment.elements instanceof Array);
	await test('Container#nth(0) is Container#first', () => fragment.nth(0) === fragment.first);
	await test('Container#lastNth(0) is Container#last', () => fragment.lastNth(0) === fragment.last);
	await test('Container#nthElement(0) is Container#firstElement', () => fragment.nthElement(0) === fragment.firstElement);
	await test('Container#lastElement(0) is Container#lastElement', () => fragment.lastNth(0) === fragment.lastElement);

	let expectedNodes = 0;
	fragment.walk(() => {
		++expectedNodes;
	});
	await test('Container#walk works as expected', () => expectedNodes === 21);

	let expectedElements = 0;
	fragment.walk('*', () => {
		++expectedElements;
	});
	await test('Container#walk "*" filter works as expected', () => expectedElements === 9);

	let expectedWalks = 0;
	fragment.walk('section', () => {
		++expectedWalks;
	});
	await test('Container#walk "section" works as expected', () => expectedWalks === 3);

	let expectedHP = 0;
	fragment.walk(/h|p/, () => {
		++expectedHP;
	});
	await test('Container#walk /h|p/ works as expected', () => expectedHP === 6);

	let expectedSections = 0;
	fragment.walk(el => el.name === 'section', () => {
		++expectedSections;
	});
	await test('Container#walk (el => el.name === "section") works as expected', () => expectedSections === 3);

	/* Test Comment
	/* ====================================================================== */

	const comment = (new Result(`<!--test   -->`, processOptions)).root.first;

	await test('Comment', () => comment instanceof Comment);
	await test('Comment#comment', () => comment.comment === 'test   ');
	await test('Comment#innerHTML', () => comment.innerHTML === 'test   ');
	await test('Comment#outerHTML', () => comment.outerHTML === '<!--test   -->');
	await test('Comment#sourceInnerHTML', () => comment.sourceInnerHTML === 'test   ');
	await test('Comment#sourceOuterHTML', () => comment.sourceOuterHTML === '<!--test   -->');

	/* Test Element
	/* ====================================================================== */

	const selfClosing = new Result(`<section ...{weird}   />`, processOptions).root.first;

	await test('Element(selfClosing)#isSelfClosing', () => selfClosing.isSelfClosing === true);
	await test('Element(selfClosing)#innerHTML', () => selfClosing.innerHTML === '');
	await test('Element(selfClosing)#outerHTML', () => selfClosing.outerHTML === '<section ...{weird}   />');
	await test('Element(selfClosing)#sourceInnerHTML', () => selfClosing.sourceInnerHTML === '');
	await test('Element(selfClosing)#sourceOuterHTML', () => selfClosing.sourceOuterHTML === '<section ...{weird}   />');

	await test('Element(selfClosing)#isSelfClosing', () => selfClosing.isSelfClosing === true);

	/* Test Element Attributes
	/* ====================================================================== */

	const duplicateAttributes1 = new Result('<section class class />', processOptions).root.first;
	const duplicateAttributes2 = new Result('<section class="foo" class="bar" />', processOptions).root.first;

	await test('Element(duplicateAttributes) contains duplicate attributes', () => duplicateAttributes1.attrs.length === 2 && duplicateAttributes1.attrs[0].value === duplicateAttributes1.attrs[1].value);
	await test('Element(duplicateAttributes) contains duplicate attributes', () => duplicateAttributes2.attrs.length === 2 && duplicateAttributes2.attrs[0].value === 'foo' && duplicateAttributes2.attrs[1].value === 'bar');

	const mutatedAttributes1 = new Result('<section class="foo" />', processOptions).root.first;

	// class="foo"
	const mutatedAttributes1OriginalAttr = mutatedAttributes1.attrs[0];
	const mutatedAttributes1OriginalAttrValue = mutatedAttributes1OriginalAttr.value;

	// id="foo" class="bar"
	mutatedAttributes1.attrs.add({ id: 'foo', class: 'bar' });

	await test('Element(mutatedAttributes) mutated attributes (via add)', () => mutatedAttributes1.attrs.length === 2);
	await test('Element(mutatedAttributes) mutated a specific attribute (via add)', () => mutatedAttributes1OriginalAttr.value !== mutatedAttributes1OriginalAttrValue);

	// class="bar"
	mutatedAttributes1.attrs.remove('id');

	await test('Element(mutatedAttributes) mutated attributes (via remove)', () => mutatedAttributes1.attrs.length === 1);

	// id="foo" class="bar"
	mutatedAttributes1.attrs.toggle('id', 'foo');

	await test('Element(mutatedAttributes) toggled a specific attribute off', () => mutatedAttributes1.attrs.length === 2 && mutatedAttributes1.attrs.get('id') === 'foo');

	mutatedAttributes1.attrs.toggle('id', 'foo');

	await test('Element(mutatedAttributes) toggled a specific attribute on', () => mutatedAttributes1.attrs.length === 1 && mutatedAttributes1.attrs.get('id') === false);

	await test('Element: Generate a new <div> from a string', () => String(new Element('div')) === '<div></div>');
	await test('Element: Generate a new <input> from a string', () => String(new Element('input')) === '<input>');
	await test('Element: Generate a new <span> from nothing', () => String(new Element()) === '<span></span>');

	await test('Element#innerHTML getter/setter', async () => {
		const { root } = new Result(`<section>Hello World</section>`, processOptions);
		const { first: section } = root;

		await test(() => section.innerHTML === 'Hello World');

		section.innerHTML = 'Hello <strong>World</strong>';
		await test(() => section.innerHTML === 'Hello <strong>World</strong>');
		await test(() => section.last.innerHTML === 'World');

		section.last.innerHTML = 'Earth';
		await test(() => section.innerHTML === 'Hello <strong>Earth</strong>');
	});

	await test('Element#outerHTML getter/setter', async () => {
		const { root } = new Result(`<section>Hello World</section>`, processOptions);

		const section = root.first;
		await test(() => section.outerHTML === '<section>Hello World</section>');

		section.outerHTML = 'Hello <strong>World</strong>';
		await test(() => root.innerHTML === 'Hello <strong>World</strong>');

		const strong = root.last;
		await test(() => strong.outerHTML === '<strong>World</strong>');

		strong.outerHTML = 'Earth';
		await test(() => root.innerHTML === 'Hello Earth');
	});

	await test('Element#textContent getter/setter', async () => {
		const { root } = new Result(`<section>Hello <strong>World</strong></section>`, processOptions);

		await test(() => root.textContent === 'Hello World');

		const section = root.first;
		section.innerHTML = 'Hello <em>World</em>';
		await test(() => root.textContent === 'Hello World');

		const strong = section.last;
		await test(() => strong.textContent === 'World');

		strong.textContent = 'Earth';
		await test(() => root.textContent === 'Hello Earth');
	});

	await test('Element entities', async () => {
		const sourceInnerData1 = '"X" &quot;X&quot;';
		const sourceOuterData1 = `<section>${sourceInnerData1}</section>`;
		const expectInnerHtml1 = '"X" &amp;quot;X&amp;quot;';
		const expectOuterHtml1 = `<section>${expectInnerHtml1}</section>`;

		const { root } = new Result(sourceOuterData1, processOptions);

		const section = root.first;
		// textContent/toString() does not transform entities
		await test(() => section.textContent === sourceInnerData1);
		await test(() => String(section) === sourceOuterData1);

		// innerHTML/outerHTML does transform entities
		await test(() => section.innerHTML === expectInnerHtml1);
		await test(() => section.outerHTML === expectOuterHtml1);

		const sourceInnerData2 = '<element> &lt;element&gt;';
		const sourceOuterData2 = `<section>${sourceInnerData2}</section>`;
		const expectInnerHtml2 = '&lt;element&gt; &amp;lt;element&amp;gt;';
		const expectOuterHtml2 = `<section>${expectInnerHtml2}</section>`;

		section.textContent = sourceInnerData2;

		// textContent/toString() does not transform entities
		await test(() => section.textContent === sourceInnerData2);
		await test(() => String(section) === sourceOuterData2);

		// innerHTML/outerHTML does transform entities
		await test(() => section.innerHTML === expectInnerHtml2);
		await test(() => section.outerHTML === expectOuterHtml2);
	});

	/* Test Container Clone
	/* ====================================================================== */

	const original = (new Result(`<p>Hello World</p>`, processOptions)).root;
	const clone = original.clone(true);

	await test('Container(clone) is not the original', () => original !== clone);
	await test('Container(clone) matches the original', () => original.outerHTML === clone.outerHTML && original.innerHTML === clone.innerHTML);

	await test('Container(clone).first.first is Text', () => clone.first.first instanceof Text);

	clone.first.first.data = 'Goodbye Earth';

	await test('get Container(clone).outerHTML', () => clone.outerHTML === '<p>Goodbye Earth</p>');

	/* Test Process
	/* ====================================================================== */

	const pHTML1 = new PHTML();
	const result1 = await pHTML1.process(html);

	await test('new PHTML().process() returns a Result', () => result1 instanceof Result);
	await test('new PHTML().process().html returns a String', () => typeof result1.html === 'string');
	await test('new PHTML().process().root returns a Fragment', () => result1.root instanceof Fragment);

	const result2 = await PHTML.process(html);

	await test('PHTML.process() returns a Result', () => result2 instanceof Result);
	await test('PHTML.process().html returns a String', () => typeof result2.html === 'string');
	await test('PHTML.process().root returns a Fragment', () => result2.root instanceof Fragment);

	await test('PHTML.process() preserves entities', async () => {
		const entitySample = ['&quot;', '&lt;', '&gt;', '&amp;'];
		const sourceHTML = entitySample.map(
			entity => `<p data-entity="${entity}">${entity}</p>`
		).join('\n');
		const { html: resultHTML } = await PHTML.process(sourceHTML);

		return sourceHTML === resultHTML;
	});

	/* Test Plugins
	/* ====================================================================== */

	await test(async () => {
		let pHTMLPluginTest1 = false;
		let pHTMLPluginTest2 = false;

		const pHTMLTestPlugin1 = new Plugin('phtml-test', opt => {
			pHTMLPluginTest1 = opt;

			return () => {
				pHTMLPluginTest2 = opt;
			}
		});

		await pHTMLTestPlugin1.process(html, {}, true);

		await test('Plugin: Plugin#process', () => pHTMLPluginTest1 === true && pHTMLPluginTest2 === true);

		pHTMLPluginTest1 = false;
		pHTMLPluginTest2 = false;

		const pHTMLInstanceWithPlugin = new PHTML([
			pHTMLTestPlugin1(true)
		]);

		await test('Plugin: Pre-Process', () => pHTMLPluginTest1 === true && pHTMLPluginTest2 !== true);

		await pHTMLInstanceWithPlugin.process(html);

		await test('Plugin: Post-Process', () => pHTMLPluginTest1 === true && pHTMLPluginTest2 === true);
	});

	/* Test Plugins
	/* ====================================================================== */

	await test('Plugins: Plugins are run in order', async () => {
		let working = false;

		await PHTML.use(
			() => {
				working = null;
			},
			() => {
				working = working === null ? true : working;
			}
		).process(html);

		return working === true;
	});

	/* Test Result Current Plugin
	/* ====================================================================== */

	await test('Plugin: result.currentPlugin', async () => {
		let isCurrentPluginCurrentPlugin = false;

		const plugin = (root, result) => {
			isCurrentPluginCurrentPlugin = result.currentPlugin === plugin;
		};

		await PHTML.use(plugin).process(html);

		return isCurrentPluginCurrentPlugin;
	});

	/* Test Plugin Warnings
	/* ====================================================================== */

	await test('Plugin: Node#warn, Result: warnings', async () => {
		const plugin = (root, result) => {
			root.warn(result, 'Something went wrong');
			root.warn(result, 'Something else went wrong');
		};

		const result = await PHTML.use(plugin).process(html);

		return result.warnings.length === 2;
	});

	/* Test Plugin Object
	/* ====================================================================== */

	await test('Plugin: Element with Observers', async () => {

		let observersRunCount = 13;

		const plugin = {
			afterElement() {
				--observersRunCount;
			},
			PElement() {
				--observersRunCount;
			},
			Root() {
				--observersRunCount;
			}
		};

		await PHTML.use(plugin).process(html);

		return !observersRunCount;
	});

	/* Test Plugin Object
	/* ====================================================================== */

	await test('Plugin: Element with Visitors and Functions', async () => {
		let observersRunCount = 13;

		const plugin1 = {
			afterElement () {
				--observersRunCount;
			},
			PElement () {
				--observersRunCount;
			},
			Root () {
				--observersRunCount;
			}
		};

		const plugin2 = async () => {
			if (observersRunCount) {
				throw new Error('incorrect visitor count');
			}
		};

		await PHTML.use([ plugin1, plugin2 ]).process(html);

		return !observersRunCount;
	});
}

tests();
