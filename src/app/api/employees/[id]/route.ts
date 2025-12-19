import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const employee = db_helpers.getEmployeeById(parseInt(id));

		if (!employee) {
			return NextResponse.json({ error: 'ไม่พบพนักงาน' }, { status: 404 });
		}

		return NextResponse.json({ success: true, data: employee });
	} catch (error) {
		console.error('Get employee error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน' },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();

		const employee = db_helpers.getEmployeeById(parseInt(id));
		if (!employee) {
			return NextResponse.json({ error: 'ไม่พบพนักงาน' }, { status: 404 });
		}

		db_helpers.updateEmployee(parseInt(id), body);
		const updatedEmployee = db_helpers.getEmployeeById(parseInt(id));

		return NextResponse.json({ success: true, data: updatedEmployee });
	} catch (error) {
		console.error('Update employee error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการแก้ไขพนักงาน' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const employee = db_helpers.getEmployeeById(parseInt(id));

		if (!employee) {
			return NextResponse.json({ error: 'ไม่พบพนักงาน' }, { status: 404 });
		}

		db_helpers.deleteEmployee(parseInt(id));
		return NextResponse.json({ success: true, message: 'ลบพนักงานสำเร็จ' });
	} catch (error) {
		console.error('Delete employee error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการลบพนักงาน' },
			{ status: 500 }
		);
	}
}
