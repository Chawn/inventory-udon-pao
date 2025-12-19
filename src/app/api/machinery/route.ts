import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get('status');

		const machinery = db_helpers.getAllMachinery(status || undefined);
		return NextResponse.json({ success: true, data: machinery });
	} catch (error) {
		console.error('Get machinery error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเครื่องจักร' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { code, name, type, brand, model, year, status, notes } = body;

		// Validate
		if (!code || !name || !type) {
			return NextResponse.json(
				{ error: 'กรุณากรอกรหัส ชื่อ และประเภทเครื่องจักร' },
				{ status: 400 }
			);
		}

		const id = db_helpers.createMachinery({
			code,
			name,
			type,
			brand,
			model,
			year,
			status: status || 'AVAILABLE',
			notes,
		});

		const machinery = db_helpers.getMachineryById(id);
		return NextResponse.json(
			{ success: true, data: machinery },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Create machinery error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการสร้างเครื่องจักร' },
			{ status: 500 }
		);
	}
}
