# Changes to pHTML

### 3.3.1 (May 3, 2019)

- Fixed: Issue with `Attribute` modification.

### 3.3.0 (May 3, 2019)

- Fixed: `Attribute` values and `Text` data now preserve raw HTML entities.
- Fixed: An issue where function plugins now consistently runs _after_ rather
  than _before_ the `Root` node is visited.
- Added: Settable `innerHTML` and `outerHTML`.
- Added: Getable and settable `textContent`.
- Added: The `use` method now also accepts multiple arguments for multiple
  plugins.
- Added: A string argument passed to `Comment` defines the comment.
- Added: A string argument passed to `Doctype` defines the doctype name.
- Added: A string argument passed to `Element` defines the element tag name.
- Added: A string argument passed to `Text` defines the text data.

### 3.2.1 (April 22, 2019)

- Fixed: An issue where `AttributeList#add` and `AttributeList#remove` might
  return the wrong value.

### 3.2.0 (April 22, 2019)

- Added: `AttributeList` supports Regular Expression searching when using
  `get`, `contains`, `add`, `remove`, `toggle`, and `indexOf`.
- Fixed: An issue where an `AttributeList` might be missing attributes.

### 3.1.0 (April 18, 2019)

- Added: Ability to override visitors on `visit()`
- Added: Ability to clone `Comment` and `Doctype` nodes

### 3.0.0 (March 16, 2019)

- Changed: `Node.observe()` to `Node.visit()`
- Changed: `Node` visitors occur before its children are visited, while `afterNode` visitors occur afterward
- Fixed: Issue with walkers walking nodes that had been moved or removed
- Fixed: Issue with `NodeList.from` not returning nodes

### 2.0.4 (March 11, 2019)

- Fixed: Issue with Node observe for pHTML and Plugin process

### 2.0.3 (March 9, 2019)

- Fixed: Issue with NodeList not normalizing Node-like comments and doctypes

### 2.0.2 (February 25, 2019)

- Fixed: Issue with NodeList not normalizing Node-like objects
- Improved: CLI usage, allowing for shorthand options and hot-installed plugins
- Improved: Source documentation and configuration

### 2.0.1 (February 18, 2019)

- Fixed: Issue running the CLI

### 2.0.0 (February 18, 2019)

- Added: Browser version
- Added: CLI version
- Added: Plugins now allow observers
- Added: `Fragment` can now take nodes
- Added: `#Result.messages` to contain warnings and other types of messages
- Changed: Parser is now smaller, synchronous, and can be run in the browser
- Changed: `Result` returns the `root` fragment syncronously
- Changed: Raw HTML spacing is added and used to stringify tags and attributes
- Changed: Tag case-sensitivity is preserved
- Changed: `source.input` is now an Object containing `html`, `from,` and `to`

### 1.2.0 (February 13, 2019)

- Added: `NodeList.from()` creates a NodeList from an array or Nodes and Strings
- Added: `Node.prepend()` to prepend items to a Node parent
- Fixed: `AttributeList.from()` to correctly parse attribute-like values
- Fixed: Issue with `new Element()` not correctly creating or moving nodes

### 1.1.6 (February 12, 2019)

- Fixed: Issue walking nodes as they change

### 1.1.5 (February 12, 2019)

- Fixed: Issue with null settings and linked attributes during cloning

### 1.1.4 (February 11, 2019)

- Fixed: Issue with empty Attributes not returning null

### 1.1.3 (February 10, 2019)

- Fixed: Issue with Plugins not being executable

### 1.1.2 (February 10, 2019)

- Fixed: Issue with resolving the parser
- Fixed: Issue with potentially generated empty text nodes around JSX

### 1.1.1 (February 10, 2019)

- Fixed: Issue with closing JSX partials breaking the parser

### 1.1.0 (February 10, 2019)

- Added: Nodes return `type` String
- Added: Nodes contain `warn` Function
- Added: Results contain `currentPlugin` property
- Added: Plugins get second `result` argument

### 1.0.0 (February 10, 2019)

- Initial version
