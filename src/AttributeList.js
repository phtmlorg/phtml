/**
* @name AttributeList
* @class
* @extends Array
* @classdesc Return a new list of {@link Element} attributes.
* @param {...Array|AttributeList|Object} attrs - An array or object of attributes.
* @returns {AttributeList}
* @example
* new AttributeList([{ name: 'class', value: 'foo' }, { name: 'id', value: 'bar' }])
* @example
* new AttributeList({ class: 'foo', id: 'bar' })
*/
class AttributeList extends Array {
	constructor (attrs) {
		super();

		if (attrs === Object(attrs)) {
			this.push(...getAttributeListArray(attrs));
		}
	}

	/**
	* Add an attribute or attributes to the current {@link AttributeList}.
	* @param {Array|Object|RegExp|String} name - The attribute to remove.
	* @param {String} [value] - The value of the attribute being added.
	* @returns {Boolean} - Whether the attribute or attributes were added to the current {@link AttributeList}.
	* @example <caption>Add an empty "id" attribute.</caption>
	* attrs.add('id')
	* @example <caption>Add an "id" attribute with a value of "bar".</caption>
	* attrs.add({ id: 'bar' })
	* @example
	* attrs.add([{ name: 'id', value: 'bar' }])
	*/
	add (nameOrAttrs, ...args) {
		return toggle(this, nameOrAttrs, ...args.slice(0, 1), true).attributeAdded;
	}

	/**
	* Return a new clone of the current {@link AttributeList} while conditionally applying additional attributes.
	* @param {...Array|AttributeList|Object} attrs - Additional attributes to be added to the new {@link AttributeList}.
	* @returns {Element} - The cloned Element.
	* @example
	* attrs.clone()
	* @example <caption>Clone the current attribute and add an "id" attribute with a value of "bar".</caption>
	* attrs.clone({ name: 'id', value: 'bar' })
	*/
	clone (...attrs) {
		return new AttributeList(Array.from(this).concat(getAttributeListArray(attrs)));
	}

	/**
	* Return whether an attribute or attributes exists in the current {@link AttributeList}.
	* @param {String} name - The name or attribute object being accessed.
	* @returns {Boolean} - Whether the attribute exists.
	* @example <caption>Return whether there is an "id" attribute.</caption>
	* attrs.contains('id')
	* @example
	* attrs.contains({ id: 'bar' })
	* @example <caption>Return whether there is an "id" attribute with a value of "bar".</caption>
	* attrs.contains([{ name: 'id': value: 'bar' }])
	*/
	contains (name) {
		return this.indexOf(name) !== -1;
	}

	/**
	* Return an attribute value by name from the current {@link AttributeList}.
	* @description If the attribute exists with a value then a String is returned. If the attribute exists with no value then `null` is returned. If the attribute does not exist then `false` is returned.
	* @param {RegExp|String} name - The name of the attribute being accessed.
	* @returns {Boolean|Null|String} - The value of the attribute (a string or null) or false (if the attribute does not exist).
	* @example <caption>Return the value of "id" or `false`.</caption>
	* // <div>this element has no "id" attribute</div>
	* attrs.get('id') // returns false
	* // <div id>this element has an "id" attribute with no value</div>
	* attrs.get('id') // returns null
	* // <div id="">this element has an "id" attribute with a value</div>
	* attrs.get('id') // returns ''
	*/
	get (name) {
		const index = this.indexOf(name);

		return index === -1
			? false
		: this[index].value;
	}

	/**
	* Return the position of an attribute by name or attribute object in the current {@link AttributeList}.
	* @param {Array|Object|RegExp|String} name - The attribute to locate.
	* @returns {Number} - The index of the attribute or -1.
	* @example <caption>Return the index of "id".</caption>
	* attrs.indexOf('id')
	* @example <caption>Return the index of /d$/.</caption>
	* attrs.indexOf(/d$/i)
	* @example <caption>Return the index of "foo" with a value of "bar".</caption>
	* attrs.indexOf({ foo: 'bar' })
	* @example <caption>Return the index of "ariaLabel" or "aria-label" matching /^open/.</caption>
	* attrs.indexOf({ ariaLabel: /^open/ })
	* @example <caption>Return the index of an attribute whose name matches `/^foo/`.</caption>
	* attrs.indexOf([{ name: /^foo/ })
	*/
	indexOf (name, ...args) {
		return this.findIndex(
			Array.isArray(name)
				? findIndexByArray
			: isRegExp(name)
				? findIndexByRegExp
			: name === Object(name)
				? findIndexByObject
			: findIndexByString
		);

		function findIndexByArray (attr) {
			return name.some(
				innerAttr => (
					'name' in Object(innerAttr)
						? isRegExp(innerAttr.name)
							? innerAttr.name.test(attr.name)
						: String(innerAttr.name) === attr.name
					: true
				) && (
					'value' in Object(innerAttr)
						? isRegExp(innerAttr.value)
							? innerAttr.value.test(attr.value)
						: getAttributeValue(innerAttr.value) === attr.value
					: true
				)
			);
		}

		function findIndexByObject (attr) {
			const innerAttr = name[attr.name] || name[toCamelCaseString(attr.name)];

			return innerAttr
				? isRegExp(innerAttr)
					? innerAttr.test(attr.value)
				: attr.value === innerAttr
			: false;
		}

		function findIndexByRegExp (attr) {
			return name.test(attr.name) && (
				args.length
					? isRegExp(args[0])
						? args[0].test(attr.value)
					: attr.value === getAttributeValue(args[0])
				: true
			);
		}

		function findIndexByString (attr) {
			return (
				attr.name === String(name) || attr.name === toKebabCaseString(name)
			) && (
				args.length
					? isRegExp(args[0])
						? args[0].test(attr.value)
					: attr.value === getAttributeValue(args[0])
				: true
			);
		}
	}

	/**
	* Remove an attribute or attributes from the current {@link AttributeList}.
	* @param {Array|Object|RegExp|String} name - The attribute to remove.
	* @param {String} [value] - The value of the attribute being removed.
	* @returns {Boolean} - Whether the attribute or attributes were removed from the {@link AttributeList}.
	* @example <caption>Remove the "id" attribute.</caption>
	* attrs.remove('id')
	* @example <caption>Remove the "id" attribute when it has a value of "bar".</caption>
	* attrs.remove('id', 'bar')
	* @example
	* attrs.remove({ id: 'bar' })
	* @example
	* attrs.remove([{ name: 'id', value: 'bar' }])
	* @example <caption>Remove the "id" and "class" attributes.</caption>
	* attrs.remove(['id', 'class'])
	*/
	remove (nameOrAttrs, ...args) {
		return toggle(this, nameOrAttrs, ...args.slice(0, 1), false).attributeRemoved;
	}

	/**
	* Toggle an attribute or attributes from the current {@link AttributeList}.
	* @param {String|Object} name_or_attrs - The name of the attribute being toggled, or an object of attributes being toggled.
	* @param {String|Boolean} [value_or_force] - The value of the attribute being toggled when the first argument is not an object, or whether the attribute should be forcably toggled.
	* @param {Boolean} [force] - Whether the attribute should be forcably toggled.
	* @returns {Boolean} - Whether any attribute was added to the current {@link AttributeList}.
	* @example <caption>Toggle the "id" attribute.</caption>
	* attrs.toggle('id')
	* @example <caption>Toggle the "id" attribute with a value of "bar".</caption>
	* attrs.toggle('id', 'bar')
	* @example
	* attrs.toggle({ id: 'bar' })
	* @example
	* attrs.toggle([{ name: 'id', value: 'bar' }])
	*/
	toggle (nameOrAttrs, ...args) {
		const result = toggle(this, nameOrAttrs, ...args);

		return result.attributeAdded || result.atttributeModified;
	}

	/**
	* Return the current {@link AttributeList} as a String.
	* @returns {String} A string version of the current {@link AttributeList}
	* @example
	* attrs.toString() // returns 'class="foo" data-foo="bar"'
	*/
	toString () {
		return this.length
			? `${this.map(
				attr => `${Object(attr.source).before || ' '}${attr.name}${attr.value === null ? '' : `=${Object(attr.source).quote || '"'}${attr.value}${Object(attr.source).quote || '"'}`}`
			).join('')}`
		: '';
	}

	/**
	* Return the current {@link AttributeList} as an Object.
	* @returns {Object} point - An object version of the current {@link AttributeList}
	* @example
	* attrs.toJSON() // returns { class: 'foo', dataFoo: 'bar' } when <x class="foo" data-foo: "bar" />
	*/
	toJSON () {
		return this.reduce(
			(object, attr) => Object.assign(
				object,
				{
					[toCamelCaseString(attr.name)]: attr.value
				}
			),
			{}
		);
	}

	/**
	* Return a new {@link AttributeList} from an array or object.
	* @param {Array|AttributeList|Object} nodes - An array or object of attributes.
	* @returns {AttributeList} A new {@link AttributeList}
	* @example <caption>Return an array of attributes from a regular object.</caption>
	* AttributeList.from({ dataFoo: 'bar' }) // returns AttributeList [{ name: 'data-foo', value: 'bar' }]
	* @example <caption>Return a normalized array of attributes from an impure array of attributes.</caption>
	* AttributeList.from([{ name: 'data-foo', value: true, foo: 'bar' }]) // returns AttributeList [{ name: 'data-foo', value: 'true' }]
	*/

	static from (attrs) {
		return new AttributeList(getAttributeListArray(attrs));
	}
}

/**
* Toggle an attribute or attributes from an {@link AttributeList}.
* @param {AttributeList} attrs - The {@link AttributeList} being modified.
* @param {String|Object} name_or_attrs - The name of the attribute being toggled, or an object of attributes being toggled.
* @param {String|Boolean} [value_or_force] - The value of the attribute being toggled when the first argument is not an object, or whether the attribute should be forcably toggled.
* @param {Boolean} [force] - Whether the attribute should be forcably toggled.
* @returns {Array} An object specifying whether any attributes were added, removed, and/or modified.
* @private
*/

function toggle (attrs, nameOrAttrs, ...args) {
	let attributeAdded = false;
	let attributeRemoved = false;
	let atttributeModified= false;

	const toggleAttrs = getAttributeListArray(nameOrAttrs, ...args);
	const force = nameOrAttrs === Object(nameOrAttrs) && typeof args[0] === 'boolean' ? args[0] : args[1];
	const isNoForceDefined = force === undefined;

	toggleAttrs.forEach(toggleAttr => {
		const index = attrs.indexOf(toggleAttr.name);

		if (index === -1) {
			if (isNoForceDefined || force) {
				attrs.push({
					name: String(toggleAttr.name),
					value: getAttributeValue(toggleAttr.value)
				});

				attributeAdded = true;
			}
		} else if (isNoForceDefined || !force) {
			attrs.splice(index, 1);

			attributeRemoved = true;
		} else {
			attrs[index].value = toggleAttr.value === undefined
				? attrs[index].value
			: getAttributeValue(toggleAttr.value);

			atttributeModified = true;
		}
	});

	return { attributeAdded, attributeRemoved, atttributeModified };
}

/**
* Return an AttributeList-compatible array from an array or object.
* @private
*/

function getAttributeListArray (attrs, value) {
	return attrs === null || attrs === undefined
		? []
	: Array.isArray(attrs)
		? attrs.map(
			attr => ({
				name: String(Object(attr).name),
				value: getAttributeValue(Object(attr).value),
				...
					Object(attr).source === Object(Object(attr).source)
						? { source: attr.source }
					: {}
			})
		)
	: attrs === Object(attrs)
		? Object.keys(attrs).map(
			name => ({
				name: toKebabCaseString(name),
				value: getAttributeValue(attrs[name])
			})
		)
	: getAttributeListArray({
		[attrs]: value
	});
}

/**
* Return a value transformed into an attribute value.
* @description Expected values are strings. Unexpected values are null, objects, and undefined. Nulls returns null, Objects with the default toString return their JSON.stringify’d value otherwise toString’d, and Undefineds return an empty string.
* @example <caption>Expected values.</caption>
* getAttributeValue('foo') // returns 'foo'
* getAttributeValue('') // returns ''
* @example <caption>Unexpected values.</caption>
* getAttributeValue(null) // returns null
* getAttributeValue(undefined) // returns ''
* getAttributeValue(['foo']) // returns '["foo"]'
* getAttributeValue({ toString() { return 'bar' }}) // returns 'bar'
* getAttributeValue({ toString: 'bar' }) // returns '{"toString":"bar"}'
* @private
*/

function getAttributeValue (value) {
	return value === null
		? null
	: value === undefined
		? ''
	: value === Object(value)
		? value.toString === Object.prototype.toString
			? JSON.stringify(value)
		: String(value)
	: String(value);
}

/**
* Return a string formatted using camelCasing.
* @param {String} value - The value being formatted.
* @example
* toCamelCaseString('hello-world') // returns 'helloWorld'
* @private
*/

function toCamelCaseString (value) {
	return isKebabCase(value)
		? String(value).replace(/-[a-z]/g, $0 => $0.slice(1).toUpperCase())
	: String(value);
}

/**
* Return a string formatted using kebab-casing.
* @param {String} value - The value being formatted.
* @description Expected values do not already contain dashes.
* @example <caption>Expected values.</caption>
* toKebabCaseString('helloWorld') // returns 'hello-world'
* toKebabCaseString('helloworld') // returns 'helloworld'
* @example <caption>Unexpected values.</caption>
* toKebabCaseString('hello-World') // returns 'hello-World'
* @private
*/

function toKebabCaseString (value) {
	return isCamelCase(value)
		? String(value).replace(/[A-Z]/g, $0 => `-${$0.toLowerCase()}`)
	: String(value);
}

/**
* Return whether a value is formatted camelCase.
* @example
* isCamelCase('helloWorld')  // returns true
* isCamelCase('hello-world') // returns false
* isCamelCase('helloworld')  // returns false
* @private
*/

function isCamelCase (value) {
	return /^\w+[A-Z]\w*$/.test(value);
}

/**
* Return whether a value is formatted kebab-case.
* @example
* isKebabCase('hello-world') // returns true
* isKebabCase('helloworld')  // returns false
* isKebabCase('helloWorld')  // returns false
* @private
*/

function isKebabCase (value) {
	return /^\w+[-]\w+$/.test(value);
}

/**
* Return whether a value is a Regular Expression.
* @example
* isRegExp(/hello-world/) // returns true
* isRegExp('/hello-world/')  // returns false
* isRegExp(new RegExp('hello-world')) // returns true
* @private
*/

function isRegExp (value) {
	return Object.prototype.toString.call(value) === '[object RegExp]';
}

export default AttributeList;
