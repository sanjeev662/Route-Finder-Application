const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: "Token has expired" });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else {
      return res.status(401).json({ message: "Token is not valid" });
    }
  }
};

module.exports = auth;
