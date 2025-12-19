import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const machinery = db_helpers.getMachineryById(parseInt(id));

		if (!machinery) {
			return NextResponse.json({ error: 'ไม่พบเครื่องจักร' }, { status: 404 });
		}

		// ดึงประวัติการมอบหมาย
		const assignments = db_helpers.getAssignmentsByMachinery(parseInt(id));

		return NextResponse.json({
			success: true,
			data: {
				...machinery,
				assignments,
			},
		});
	} catch (error) {
		console.error('Get machinery error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเครื่องจักร' },
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

		const machinery = db_helpers.getMachineryById(parseInt(id));
		if (!machinery) {
			return NextResponse.json({ error: 'ไม่พบเครื่องจักร' }, { status: 404 });
		}

		db_helpers.updateMachinery(parseInt(id), body);
		const updatedMachinery = db_helpers.getMachineryById(parseInt(id));

		return NextResponse.json({ success: true, data: updatedMachinery });
	} catch (error) {
		console.error('Update machinery error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการแก้ไขเครื่องจักร' },
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
		const machinery = db_helpers.getMachineryById(parseInt(id));

		if (!machinery) {
			return NextResponse.json({ error: 'ไม่พบเครื่องจักร' }, { status: 404 });
		}

		db_helpers.deleteMachinery(parseInt(id));
		return NextResponse.json({ success: true, message: 'ลบเครื่องจักรสำเร็จ' });
	} catch (error) {
		console.error('Delete machinery error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการลบเครื่องจักร' },
			{ status: 500 }
		);
	}
}
