import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { db_helpers } from '@/lib/db';

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get('authorization');
		const token = extractTokenFromHeader(authHeader);

		if (!token) {
			return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
		}

		const payload = verifyToken(token);
		if (!payload) {
			return NextResponse.json(
				{ error: 'Token ไม่ถูกต้องหรือหมดอายุ' },
				{ status: 401 }
			);
		}

		// ดึงข้อมูล user จาก database
		const user = db_helpers.getUserByUsername(payload.username);
		if (!user) {
			return NextResponse.json({ error: 'ไม่พบข้อมูล user' }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				username: user.username,
				fullName: user.full_name,
			},
		});
	} catch (error) {
		console.error('Get user error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล user' },
			{ status: 500 }
		);
	}
}
