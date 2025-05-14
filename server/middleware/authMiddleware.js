const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticateUser;
