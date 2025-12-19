import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './db';

const JWT_SECRET =
	process.env.JWT_SECRET ||
	'your-super-secret-jwt-key-change-this-in-production';

export interface JWTPayload {
	userId: number;
	username: string;
	fullName: string;
}

/**
 * Hash password ด้วย bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10);
}

/**
 * ตรวจสอบ password กับ hash
 */
export async function verifyPassword(
	password: string,
	hash: string
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/**
 * สร้าง JWT token
 */
export function generateToken(user: User): string {
	const payload: JWTPayload = {
		userId: user.id,
		username: user.username,
		fullName: user.full_name,
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: '7d', // token หมดอายุใน 7 วัน
	});
}

/**
 * ตรวจสอบและ decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload;
	} catch (error) {
		return null;
	}
}

/**
 * ดึง token จาก Authorization header
 */
export function extractTokenFromHeader(
	authHeader: string | null
): string | null {
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}
	return authHeader.substring(7);
}
