/**
 * this is your configuration file defaults.
 *
 * You can create additional configuration files to that the server will load based on your
 * environment.  For example, if you want to have specific settings for production which are different
 * than your local development environment, you can create a production.js and a local.js.  Any changes
 * in those files will overwrite changes to this file (a object merge is performed). By default, your
 * local.js file will not be commited to git or the registry.
 *
 * This is a JavaScript file (instead of JSON) so you can also perform logic in this file if needed.
 */
module.exports = {
	// these are your generated API keys.  They were generated uniquely when you created this project.
	// DO NOT SHARE these keys with other projects and be careful with these keys since they control
	// access to your API using the default configuration.  if you don't want two different keys for
	// production and test (not recommended), use the key 'apikey'.  To simulate running in production,
	// set the environment variable NODE_ENV to production before running such as:
	//
	// NODE_ENV=production appc run
	//
	// by default the authentication strategy is 'basic' which will use HTTP Basic Authorization where the
	// usename is the key and the password is blank.  the other option is 'apikey' where the value of the
	// APIKey header is the value of the key.  you can also set this to 'plugin' and define the key 'APIKeyAuthPlugin'
	// which points to a file or a module that implements the authentication strategy
	APIKeyAuthType: 'plugin',
    APIKeyAuthPlugin: 'index.js',
    secret: 'secret',
    SamlAuth : {
        loginUrl: '/saml/login',
        callbackUrl: '/saml/response/callback',
        allowedPaths: ['/youFoo'],
        resultObject: {
            firstName: 'firstname',
            lastName: 'lastname',
            email: 'email',
            username: 'username',
            language: 'preferredLanguage'
        },
        passport: {
            strategy: 'saml',
            saml: {
                callbackUrl: 'https://localhost:8080/response/callback',
                entryPoint: 'https://app.onelogin.com/trust/saml2/http-post/sso/371755',
                issuer: 'cloud:passport:saml',
                authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
                logoutCallbackUrl: 'https://localhost:8080/saml/logout'//,
            }
        }
    },

	// your connector configuration goes here
	connectors: {
	}
};
