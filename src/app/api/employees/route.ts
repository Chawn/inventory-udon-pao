import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const teamId = searchParams.get('team_id');

		const employees = db_helpers.getAllEmployees(
			teamId ? parseInt(teamId) : undefined
		);

		return NextResponse.json({ success: true, data: employees });
	} catch (error) {
		console.error('Get employees error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { code, first_name, last_name, position, phone, team_id } = body;

		// Validate
		if (!code || !first_name || !last_name) {
			return NextResponse.json(
				{ error: 'กรุณากรอกรหัส ชื่อ และนามสกุลพนักงาน' },
				{ status: 400 }
			);
		}

		const id = db_helpers.createEmployee({
			code,
			first_name,
			last_name,
			position,
			phone,
			team_id,
		});

		const employee = db_helpers.getEmployeeById(id);
		return NextResponse.json(
			{ success: true, data: employee },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Create employee error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการสร้างพนักงาน' },
			{ status: 500 }
		);
	}
}
