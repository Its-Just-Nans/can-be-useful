var http = require("http");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var saml = require("passport-saml");
var fs = require("fs");

//declare constants
const PORT = 3000;

/** SAML Configurations attributes
 * callbackurl : apps url for IDP to response post authetication
 * signout: apps url for IDP to notify app post signout
 * entrypoint: IDP url to redirect for authentication
 * entityId : Apps Id
 */
const samlConfig = {
    issuer: "EntrerpiseCustomApp",
    entityId: "Saml-SSO-App",
    callbackUrl: "http://localhost:3000/login/callback",
    signOut: "http://localhost:3000/signout/callback",
    entryPoint: "http://localhost:7000/auth/realms/EnterpriseApps/protocol/saml",
};

// For running apps on https mode
// load the public certificate
const sp_pub_cert = fs.readFileSync("sp-pub-cert.pem", "utf8");

//load the private key
const sp_pvk_key = fs.readFileSync("sp-pvt-key.pem", "utf8");

//Idp's certificate from metadata
const idp_cert = fs.readFileSync("idp-pub-key.pem", "utf8");

passport.serializeUser(function (user, done) {
    //Serialize user, console.log if needed
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    //Deserialize user, console.log if needed
    done(null, user);
});

// configure SAML strategy for SSO
const samlStrategy = new saml.Strategy(
    {
        callbackUrl: samlConfig.callbackUrl,
        entryPoint: samlConfig.entryPoint,
        issuer: samlConfig.issuer,
        identifierFormat: null,
        decryptionPvk: sp_pvk_key,
        cert: idp_cert,
        signingCert: sp_pub_cert,
        privateKey: sp_pvk_key,
        signatureAlgorithm: "sha256",
        digestAlgorithm: "sha256",
        // validateInResponseTo: true,
        // disableRequestedAuthnContext: true,
    },
    (profile, done) => {
        console.log("passport.use() profile: %s \n", JSON.stringify(profile));
        return done(null, profile);
    }
);

//initialize the express middleware
const app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configure session management
// Note: Always configure session before passport initialization & passport session, else error will be encounter
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);

passport.use("samlStrategy", samlStrategy);
app.use(passport.initialize({}));
app.use(passport.session({}));

/** Configure routes **/
// default route
app.get("/", (req, res) => {
    res.send("Weclome to Single Sign-On Application<a href='/login'>login</a>");
});

//login route
app.get(
    "/login",
    (req, res, next) => {
        //login handler starts
        console.log("login ?");
        next();
    },
    passport.authenticate("samlStrategy")
);

//post login callback route
app.post(
    "/login/callback",
    (req, res, next) => {
        //login callback starts
        debugger;
        next();
    },
    passport.authenticate("samlStrategy"),
    (req, res) => {
        //SSO response payload
        debugger;
        res.send(req.user.attributes);
    }
);

app.get("/saml", (req, res, next) => {
    const a = samlStrategy.generateServiceProviderMetadata(sp_pub_cert, idp_cert);
    res.setHeader("content-type", "application/xml");
    res.send(a);
});
app.get("/forum", (req, res, next) => {
    const a = `<?xml version="1.0"?>
    <md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                         entityID="https://forumtelecomparis.fr/auth/saml2/acs/">
        <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
            <md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</md:NameIDFormat>
            <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                                         Location="https://forumtelecomparis.fr/auth/saml2/acs/"
                                         index="1" />
        </md:SPSSODescriptor>
        <md:Organization>
           <md:OrganizationName xml:lang="en-US">ForumTelecomParis</md:OrganizationName>
           <md:OrganizationDisplayName xml:lang="en-US">Forum Télécom Paris</md:OrganizationDisplayName>
           <md:OrganizationURL xml:lang="en-US">https://forumtelecomparis.fr</md:OrganizationURL>
        </md:Organization>
        <md:ContactPerson contactType="support">
            <md:GivenName>Contact Forum Télécom Paris</md:GivenName>
            <md:EmailAddress>contact@forumtelecomparis.fr</md:EmailAddress>
        </md:ContactPerson>
    </md:EntityDescriptor>`;
    res.setHeader("content-type", "application/xml");
    res.send(a);
});

//Run the http server
const server = http
    .createServer(
        {
            key: sp_pvk_key,
            cert: sp_pub_cert,
        },
        app
    )
    .listen(PORT, () => {
        console.log("Listening on http://localhost:%d", server.address().port);
    });
