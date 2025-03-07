import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

// Middleware function to authenticate JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object
  // Get authorization header from request
  const authHeader = req.headers.authorization;
  // Check if authorization header is present
  if (authHeader) {
    // Extract token from the authorization header
    const token = authHeader.split(' ')[1];
    // Error Handling
    console.log(token);
    console.log(authHeader);

    // Get secret key from the environment variables
    const secretKey = process.env.JWT_SECRET_KEY || '';
    // Verify JWT token
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      // Attach user information to request object
      req.user = user as JwtPayload;
      return next();
    });
  } else {
    // Send unauthorized status if no authorization header is present
    res.sendStatus(401);
  }
};
