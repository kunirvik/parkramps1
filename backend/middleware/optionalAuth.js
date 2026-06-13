const jwt = require("jsonwebtoken")



 function optionalAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return next();
  }

  try {
    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

  } catch {
    // ignore invalid token
  }

  next();
}

module.exports =  optionalAuth ;