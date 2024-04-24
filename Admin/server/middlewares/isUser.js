// Middleware function to verify user role as User
const verifyUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'user') {
        return res.status(403).json({ success: false, message: 'Access denied. Not a user role.' });
      }
      req.user = decoded; // Attach the decoded user object to the request for further use
      next();
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid token.' });
    }
  };
  
  // Middleware function to verify user role as Admin
  const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Not an admin role.' });
      }
      req.user = decoded; // Attach the decoded user object to the request for further use
      next();
    } catch (error) {
      res.status(400).json({ success: false, message: 'Invalid token.' });
    }
  };
  