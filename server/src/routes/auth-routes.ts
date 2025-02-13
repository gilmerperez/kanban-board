import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Login function to authenticate a user
export const login = async (req: Request, res: Response) => {
  // TODO: If the user exists and the password is correct, return a JWT token
  // Extract username and password from request body
  const { username, password } = req.body;

  // Find the user in the database by username
  const user = await User.findOne({ where: { username } });

  if (!user) { // If user is not found, send response
    return res.status(401).json({ message: "Authentication failed!" });
  }

  // Compare the provided password with the stored hashed password
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) { // If passwords don't match, send response
    return res.status(401).json({ message: "Authentication failed!" });
  }

  // Get the secret key from environment variables
  const secretKey = process.env.JWT_SECRET_KEY || '';

  // Generate JWT token for authenticated user
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h'});
  return res.json({ token }); // Send token as JSON response
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;