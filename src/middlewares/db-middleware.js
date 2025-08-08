import { connectDB } from "../database";

export async function dbMiddleware(req, res, next) {
  try {
    const db = await connectDB()
    console.log('DB connected to', db.connection.name);
    next();
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ message: 'Database connection error' });
  }
}