"use strict";
var fs = require('fs');
var Authentication_1 = require('./Authentication');
var Dispatcher = (function () {
    function Dispatcher(server, config) {
        this.server = server;
        this.config = config;
    }
    Dispatcher.prototype.getInstanceOf = function (className) {
        var classInstance;
        switch (className) {
            case 'Authentication':
                classInstance = new Authentication_1.Authentication(this.server, this.config);
                break;
        }
        if (classInstance === undefined)
            throw "Authentication method doesn't exist.";
        return classInstance;
    };
    Dispatcher.prototype.getConfig = function () {
        var config;
        try {
            fs.accessSync('conf/appc.saml.default.js');
            var realPath = fs.realpathSync('conf/appc.saml.default.js');
            config = require(realPath);
        }
        catch (error) {
            this.server.logger.debug('Could not load configuration file. Error was : ' + error);
            if (this.server.config && this.server.config.SamlAuth) {
                config = this.server.config.SamlAuth;
            }
        }
        if (!config) {
            throw new Error('Please provide a valid configuration object for the appcelerator-saml module.');
        }
        this.config = config;
        return config;
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map