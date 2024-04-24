// Define the verifyAdmin middleware function
const verifyAdmin = (req, res, next) => {
    // Check if the request contains a valid JWT token
    const token = req.header('Authorization');
    console.log(token)
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      // Check if the decoded token contains the admin role
      if (decoded.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
      }
      // If the user is an admin, proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Return an error if the token is invalid
      res.status(400).json({ success: false, message: 'Invalid token.'+ error.message });
    }
  };
  
  export { verifyAdmin };
  