# pHTML [<img src="https://phtmlorg.github.io/phtml/logo.svg" alt="pHTML" width="90" height="90" align="right">][pHTML]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[pHTML] is a tool for transforming HTML with JavaScript. Its plugin system
can lint your HTML, support variables and mixins, transpile future HTML syntax,
inline images, and more.

## Usage

Transform HTML files directly from the command line:

```bash
npx phtml source.html output.html
```

Include plugins directly from the command line:

```bash
npx phtml source.html output.html -p @phtml/markdown,@phtml/image-alt
```

```bash
echo "<h1 md>pHTML **Markdown**</h1>" | npx phtml -p @phtml/markdown

# <h1>pHTML <strong>Markdown</strong></h1>
```

### Node

Add [pHTML] to your build tool:

```bash
npm install phtml --save-dev
```

Use [pHTML] to process your CSS:

```js
const pHTML = require('phtml');

pHTML.process(YOUR_HTML, /* processOptions */, /* pluginOrPlugins */);
```

#### Node Example

```js
const pHTML = require('phtml');

const html = `<my-component class="main">
  <title>Super Title</title>
  <text>Awesome Text</text>
</my-component>`;

pHTML.process(html, { from: 'my-component.html' }).then(console.log);

/* Result {
  from: 'component.html',
  to: 'component.html',
  root: Fragment {
    name: '#document-fragment',
    nodes: NodeList [
      Element {
        name: "my-component",
        attrs: AttributeList [
          { name: "class", value: "main" }
        ],
        nodes: NodeList [
          Text "\n  ",
          Element {
            name: "title",
            nodes: NodeList [
              Text "Super Title"
            ]
          },
          Text "\n  ",
          Element {
            name: "text",
            nodes: NodeList [
              Text "Awesome Text"
            ]
          },
          Text "\n"
        ]
      }
    ]
  }
}
```

#### Using Plugins in Node

Add a [pHTML] Plugin to your build tool:

```bash
npm install phtml-some-thing --save-dev
```

```js
const pHTML = require('phtml');
const postHtmlSomeThing = require('phtml-some-thing');

pHTML.use(
  postHtmlSomeThing(/* pluginOptions */)
).process(YOUR_HTML);
```

## Plugins

- **[pHTML CSS](https://github.com/phtmlorg/phtml-css)**: Transform inline CSS in HTML.
- **[pHTML Define](https://github.com/phtmlorg/phtml-define)**: Use custom defined elements HTML.
- **[pHTML Doctype](https://github.com/phtmlorg/phtml-doctype)**: Automatically add the doctype to HTML.
- **[pHTML H Element](https://github.com/phtmlorg/phtml-h-element)**: Write contextual headings using `<h>` in HTML.
- **[pHTML Image Alt](https://github.com/phtmlorg/phtml-image-alt)**: Automatically add image alt attributes in HTML.
- **[pHTML Image Size](https://github.com/phtmlorg/phtml-image-size)**: Automatically add image size attributes in HTML.
- **[pHTML Include](https://github.com/phtmlorg/phtml-include)**: Embed HTML partials in HTML.
- **[pHTML JS](https://github.com/phtmlorg/phtml-js)**: Transform inline JS in HTML.
- **[pHTML JSX](https://github.com/phtmlorg/phtml-jsx)**: Use JSX in HTML.
- **[pHTML Markdown](https://github.com/phtmlorg/phtml-markdown)**: Write markdown in HTML.
- **[pHTML Schema](https://github.com/phtmlorg/phtml-schema)**: Generate schema.org microdata in HTML.
- **[pHTML Self Closing](https://github.com/phtmlorg/phtml-self-closing)**: Expand self-closing tags in HTML.
- **[pHTML Template](https://github.com/phtmlorg/phtml-template)**: Create Custom Elements from Templates in HTML.

### Plugin Creation

```js
const { Plugin } = require('phtml');

module.exports new Plugin('phtml-plugin-name', pluginOptions => {
  // initialization logic

  return {
    Element(element, result) {
      // runtime logic, do something with an element
    },
    Root(root, result) {
      // runtime logic, do something with the root
    }
  };
});
```

```js
const { Plugin } = require('phtml');

module.exports = new Plugin('phtml-plugin-name', pluginOptions => {
  // initialization logic

  return (root, result) => {
    // runtime logic
  };
});
```

[cli-img]: https://img.shields.io/travis/phtmlorg/phtml.svg
[cli-url]: https://travis-ci.org/phtmlorg/phtml
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/phtml.svg
[npm-url]: https://www.npmjs.com/package/phtml

[pHTML]: https://github.com/phtmlorg/phtml
