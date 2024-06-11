// jestSetup.js
global.setImmediate = (callback) => {
	return setTimeout(callback, 0);
};

global.clearImmediate = (immediateId) => {
	return clearTimeout(immediateId);
};
