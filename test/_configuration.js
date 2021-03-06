/* global Arrow, connector, server */
var base = require('./_init'),
    should = require('should'),
    assert = require('assert'),
    async = require('async'),
    request = require('request'),
    path = require('path'),
    saml = require('../lib/'),
    dispatch = require('../lib/Dispatcher'),
    configuration = require('../lib/model/Configuration');

describe('model/Configuration', function() {
    var auth;

    before(function(next) {
        server.config.SamlAuth.passport.saml.privateCert = false;
        server.config.SamlAuth.passport.saml.cert = false;
        auth = new saml.SamlAuth(server);
        next();
    });

    it('should build configuration from saml response', function(next) {
        var Conf = new configuration.ConfigurationObject();
        var profile = {
            'username': 'sampleStringUID',
            'email': 'name@domain.com',
            'firstname': 'Foo',
            'preferredLanguage': 'en',
            'lastname': 'Barry'
        };
        var resultObject = {
            'username': 'sampleStringUID',
            'email': 'name@domain.com',
            'firstName': 'Foo',
            'language': 'en',
            'lastName': 'Barry'
        };
        var result = Conf.createResultObject(profile, auth.config);
        (result).should.be.eql(resultObject);
        next();
    });

});