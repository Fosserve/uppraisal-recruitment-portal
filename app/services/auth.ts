import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

// In a real application, this would be replaced with a database
const users: User[] = [];

export const authService = {
  async register(email: string, password: string, name: string): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      password: hashedPassword,
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  verifyToken(token: string): { userId: string; email: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}; 