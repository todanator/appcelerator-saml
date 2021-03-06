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

describe('SamlAuth', function() {
    var auth;

    before(function(next) {
        auth = new saml.SamlAuth(server);
        next();
    });

    it('should initialize Dispatcher properly', function(next) {
        should(auth).be.an.Object();
        should(auth.config).be.an.Object();
        should(auth.config).be.eql(server.config.SamlAuth);
        next();
    });


    it('should throw error on invalid configuration', function(next) {
        //Create a copy of the server
        var _server = {
            config: {},
            logger: server.logger
        };
        (function() {
            return new saml.SamlAuth(_server);
        }).should.throw("Please provide a valid configuration object for the appcelerator-saml module.");
        //Dispatcher should also throw the same error
        (function() {
            var _server = {
                config: {},
                logger: server.logger
            };
            var _dispatch = new dispatch.Dispatcher(_server, []);
            return _dispatch.getConfig();
        }).should.throw("Please provide a valid configuration object for the appcelerator-saml module.");
        next();
    });

    it('should initialize the correct Authenticator', function(next) {
        var _auth = auth.auth;
        var dispatch = auth.getDispatcher();
        //Default authentication should be OK
        _auth.should.be.ok();
        //Add an Authenticator that doesn't exist
        (function() { return dispatch.getInstanceOf('OutOfThinAir'); }).should.throw();
        //Authenticator should have the correct settings
        should(_auth.config).be.eql(auth.config);
        next();
    });


    it('should match all urls', function(next) {
        should(auth.matchURL({})).be.true;
        next();
    });

    /**
     * The plugin checks if cert is enabled, if so tryes to load the actual file. 
     * Let's check what happens if the files (pem + cert) don't exist...
     */
    it('should check if cert files exist', function(next) {
        var dispatch = auth.getDispatcher();
        auth.config.passport.saml.privateCert = true;
        auth.config.passport.saml.cert = true;
        (function() { return dispatch.getInstanceOf('Authentication'); }).should.throw();//actually fs will throw before Authentication.js does
        next();
    });

    //Check the validateRequest funciton directly
    it('should validate paths', function(next) {
        var req = {};
        var res = {};
        req.url = '/wrongUri';
        req.isAuthenticated = function() { return false; };
        auth.config.loginUrl = undefined;
        auth.config.allowedPaths = undefined;
        //check if error is thrown
        (function() {
            try {
                auth.validateRequest(req, res);
            } catch (E) {
                throw E;
            }
        }).should.throw();
        //reset the configuration
        auth.config.loginUrl = '/saml/login';
        auth.config.allowedPaths = ['/youFoo'];
        next();
    });

    //Check the validateRequest function with an actual request
    it('should validate Requests', function validatesRequests(next) {
        //Url to the foo Route registered in app.js
        var url = 'http://localhost:' + server.port + '/fooMe';
        //First off, lets check if the correct auth type is set
        should(server.config.APIKeyAuthType).be.eql('plugin');
        should(server.config.APIKeyAuthPlugin).be.eql('index.js'); // yes, that's a hack :)
        //And now, let's make an unauthenticated request
        request({
            method: 'GET',
            url: url,
            json: true
        }, function(err, response, body) {
            //Request should not be authenticated
            should(body.success).be.false;
            should(body.message).containEql('Unauthorized');
            next();
        });
    });

    it('should allow access to pre-configured paths', function prePaths(next) {
        //Url to the foo Route registered in app.js
        var url = 'http://localhost:' + server.port + '/youFoo';
        //First off, lets check if the correct auth type is set
        should(server.config.APIKeyAuthType).be.eql('plugin');
        should(server.config.APIKeyAuthPlugin).be.eql('index.js'); // yes, that's a hack :)
        //And now, let's make an unauthenticated request, to an allowed (in config) route
        request({
            method: 'GET',
            url: url,
            json: true
        }, function(err, response, body) {
            //Request should not be authenticated
            should(body.success).be.true;
            should(body).containEql('<p>You are now authenticated!</p>');
            next();
        });
    });

});
