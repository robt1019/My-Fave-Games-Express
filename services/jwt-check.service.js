const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI,
  }),
  audience: process.env.API_URL,
  issuer: process.env.AUTH0_DOMAIN,
  algorithms: ["RS256"],
});

module.exports = {
  jwtCheck,
};
