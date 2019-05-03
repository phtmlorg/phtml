const isWin32    = process.platform === 'win32';
const passSymbol = isWin32 ? '√' : '✔';
const failSymbol = isWin32 ? '×' : '✖';

function wait (name) {
	if (typeof name === 'string') {
		process.stdout.write(`\x1b[2m${'…'}\x1b[0m phtml \x1b[2m${name}\x1b[0m...`);
	}
}

function pass (name) {
	if (typeof name === 'string') {
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(`\x1b[32m${passSymbol}\x1b[0m phtml \x1b[2m${name}\x1b[0m\n`);
	}
}

function fail (name, error) {
	if (typeof name === 'string') {
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(`\x1b[31m${failSymbol}\x1b[0m phtml \x1b[2m${name}\x1b[0m\n${error ? `  ${error}\n` : ''}`);
	}
}

async function test (name, fn) {
	fn = fn || name;

	try {
		wait(name);

		const result = await fn();

		if (result !== false) {
			pass(name);
		} else {
			fail(name);

			if (typeof name === 'string') {
				process.exitCode = 1;
			} else {
				throw '↑ failed';
			}
		}
	} catch (error) {
		fail(name, error);

		if (typeof name === 'string') {
			process.exitCode = 1;
		} else {
			throw error;
		}
	}
}

module.exports = test;
