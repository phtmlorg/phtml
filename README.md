# PostHTML [<img src="https://jonathantneal.github.io/reshape-logo.svg" alt="PostHTML" width="90" height="90" align="right">][PostHTML]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostHTML] is a tool for transforming HTML with JavaScript. Its plugin system
can lint your HTML, support variables and mixins, transpile future HTML syntax,
inline images, and more.

```js
import PostHTML from '@jonathantneal/posthtml';

const html = `<component class="main">
  <title>Super Title</title>
  <text>Awesome Text</text>
</component>`;

PostHTML.process(html, { from: 'component.html' }).then(console.log);

/* Result {
  from: 'component.html',
  to: 'component.html',
  root: Fragment {
    name: '#document-fragment',
    nodes: [
      Element {
        name: "component",
        attrs: {
          class: "main"
        },
        nodes: [
          Text "\n  ",
          Element {
            name: "title",
            nodes: [
              Text "Super Title"
            ]
          },
          Text "\n  ",
          Element {
            name: "text",
            nodes: [
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

## Usage

Add [PostHTML] to your build tool:

```bash
npm install posthtml --save-dev
```

#### Node

Use [PostHTML] to process your CSS:

```js
import PostHTML from 'posthtml';

PostHTML.process(YOUR_HTML, /* processOptions */, /* pluginOrPlugins */);
```

#### Plugins

Add a [PostHTML] Plugin to your build tool:

```bash
npm install posthtml-some-thing --save-dev
```

```js
import PostHTML from '@jonathantneal/posthtml';
import postHtmlSomeThing from 'posthtml-some-thing';

PostHTML.use(
  postHtmlSomeThing(/* pluginOptions */)
).process(YOUR_HTML);
```

[cli-img]: https://img.shields.io/travis/jonathantneal/posthtml.svg
[cli-url]: https://travis-ci.org/jonathantneal/posthtml
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/@jonathantneal/posthtml.svg
[npm-url]: https://www.npmjs.com/package/@jonathantneal/posthtml

[PostHTML]: https://github.com/jonathantneal/posthtml
