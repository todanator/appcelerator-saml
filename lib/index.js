"use strict";
var Cookies = require("cookies");
var fs = require('fs');
var Dispatcher_1 = require('./Dispatcher');
var SamlAuth = (function () {
    function SamlAuth(server) {
        this.server = server;
        var dispatcher = this.getDispatcher();
        this.config = dispatcher.getConfig();
        this.auth = dispatcher.getInstanceOf('Authentication');
        this.passport = this.auth.passport;
    }
    SamlAuth.prototype.getDispatcher = function () {
        var dispatcher = new Dispatcher_1.Dispatcher(this.server, this.config);
        return dispatcher;
    };
    SamlAuth.prototype.matchURL = function (request) {
        return true;
    };
    SamlAuth.prototype.validateRequest = function (request, response) {
        var cookies = new Cookies(request, response);
        if (!request.isAuthenticated()) {
            return this._authenticateRoute(request);
        }
        else {
            return true;
        }
    };
    SamlAuth.prototype._authenticateRoute = function (request) {
        var paths;
        var should_pass = false;
        if (!this.config.allowedPaths) {
            if (!this.config.loginUrl)
                throw "You should set the 'loginUrl' in the module configuration";
            paths = new Array(this.config.loginUrl);
        }
        else {
            paths = this.config.allowedPaths;
        }
        for (var i = 0; i < paths.length; i++) {
            if (request.url.indexOf(paths[i]) === 0)
                should_pass = true;
        }
        return should_pass;
    };
    return SamlAuth;
}());
exports.SamlAuth = SamlAuth;
//# sourceMappingURL=index.js.map