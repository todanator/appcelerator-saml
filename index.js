var auth = require('./lib');
exports = module.exports = auth.SamlAuth

// if this is being run directly, then attempt to load it as
// server instead of module
if (module.id === '.') {
	var fs = require('fs'),
		path = require('path'),
		appjs = path.join(__dirname, 'app.js');
	if (fs.existsSync(appjs)){
		try {
			require(appjs);
		}
		catch (E) {
			console.error(E)
		}
	}
}