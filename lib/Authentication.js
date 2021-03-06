"use strict";
var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var Cookies = require("cookies");
var fs = require('fs');
var Configuration_1 = require('./model/Configuration');
var Authentication = (function () {
    function Authentication(server, config) {
        this.server = server;
        this.setConfig(config);
        this._passport = passport;
        this._initializePassport(this._passport);
        if (this.server && this.server.app) {
            this.initPassport();
        }
    }
    Object.defineProperty(Authentication.prototype, "passport", {
        get: function () {
            return this._passport;
        },
        enumerable: true,
        configurable: true
    });
    Authentication.prototype.initPassport = function () {
        this.server.app.use(this._passport.initialize());
        this.server.app.use(this._passport.session());
    };
    Authentication.prototype.setConfig = function (config) {
        if (config) {
            this.config = config;
        }
        else {
            this.config = new Configuration_1.ConfigurationObject();
        }
    };
    Authentication.prototype._initializePassport = function (passp) {
        passp.serializeUser(function (user, done) {
            done(null, user);
        });
        passp.deserializeUser(function (user, done) {
            done(null, user);
        });
        if (this.config.passport.saml.privateCert && this.config.passport.saml.cert) {
            if (!fs.readFileSync(this.config.privateCertLocation, 'utf-8')) {
                throw "Specified certificate file was not found";
            }
            this.config.passport.saml.privateCert = fs.readFileSync(this.config.privateCertLocation, 'utf-8');
            this.config.passport.saml.cert = fs.readFileSync(this.config.certLocation, 'utf-8');
        }
        var configuration = this.config;
        var samlStartegy = new SamlStrategy(this.config.passport.saml, function (profile, done) {
            var resultConfig = new Configuration_1.ConfigurationObject();
            var resultObject = resultConfig.createResultObject(profile, configuration);
            return done(null, resultObject);
        });
        if (this.config.passport.saml.privateCert) {
            samlStartegy.generateServiceProviderMetadata(this.config.passport.saml.privateCert);
        }
        passp.use(samlStartegy);
    };
    return Authentication;
}());
exports.Authentication = Authentication;
//# sourceMappingURL=Authentication.js.map