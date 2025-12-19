import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { username, password } = body;

		// Validate input
		if (!username || !password) {
			return NextResponse.json(
				{ error: 'กรุณากรอก username และ password' },
				{ status: 400 }
			);
		}

		// ค้นหา user
		const user = db_helpers.getUserByUsername(username);
		if (!user) {
			return NextResponse.json(
				{ error: 'Username หรือ password ไม่ถูกต้อง' },
				{ status: 401 }
			);
		}

		// ตรวจสอบ password
		const isValidPassword = await verifyPassword(password, user.password_hash);
		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Username หรือ password ไม่ถูกต้อง' },
				{ status: 401 }
			);
		}

		// สร้าง JWT token
		const token = generateToken(user);

		return NextResponse.json({
			success: true,
			token,
			user: {
				id: user.id,
				username: user.username,
				fullName: user.full_name,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
			{ status: 500 }
		);
	}
}
