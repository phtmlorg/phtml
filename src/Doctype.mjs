import Node from './Node';

/**
* @name Doctype
* @class
* @extends Node
* @classdesc Create a new {@link Doctype} {@link Node}.
* @param {Object} settings - Custom settings applied to the {@link Doctype}.
* @param {String} settings.name - Name of the {@link Doctype}.
* @param {String} settings.publicId - Public identifier portion of the {@link Doctype}.
* @param {String} settings.systemId - System identifier portion of the {@link Doctype}.
* @param {Object} settings.source - Source mapping of the {@link Doctype}.
* @return {Doctype}
* @example
* new Doctype({ name: 'html' }) // <!doctype html>
*/
class Doctype extends Node {
	constructor (settings) {
		super();

		Object.assign(
			this,
			{
				name: String(Object(settings).name || 'html'),
				publicId: Object(settings).publicId || null,
				systemId: Object(settings).systemId || null,
				source: Object(Object(settings).source)
			}
		);
	}

	/**
	* Return the current {@link Doctype} as a String.
	* @returns {String}
	*/
	toString () {
		const publicId = this.publicId ? ` PUBLIC "${this.publicId}"` : '';
		const systemId = this.systemId ? ` "${this.systemId}"` : ''
		const name = publicId || systemId ? `${this.name}`.toUpperCase() : String(this.name);
		const doctype = publicId || systemId ? `DOCTYPE` : 'doctype';

		return `<!${doctype} ${name}${publicId}${systemId}>`;
	}

	/**
	* Return the current {@link Doctype} as an Object.
	* @returns {Object}
	*/
	toJSON () {
		return {
			name: this.name,
			publicId: this.publicId,
			systemId: this.systemId
		};
	}
}

export default Doctype;
