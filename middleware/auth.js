function authenticateAndAuthorize(req, res, next){
    console.log("Authenticating...");
    console.log("Authorizing...");
    next();
}

module.exports = authenticateAndAuthorize;