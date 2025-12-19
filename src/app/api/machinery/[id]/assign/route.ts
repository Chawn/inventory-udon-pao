import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { project_id, assigned_date, return_date, notes } = body;

		// Validate
		if (!project_id || !assigned_date) {
			return NextResponse.json(
				{ error: 'กรุณาระบุโครงการและวันที่มอบหมาย' },
				{ status: 400 }
			);
		}

		// ตรวจสอบว่าเครื่องจักรมีอยู่
		const machinery = db_helpers.getMachineryById(parseInt(id));
		if (!machinery) {
			return NextResponse.json({ error: 'ไม่พบเครื่องจักร' }, { status: 404 });
		}

		// ตรวจสอบว่าโครงการมีอยู่
		const project = db_helpers.getProjectById(project_id);
		if (!project) {
			return NextResponse.json({ error: 'ไม่พบโครงการ' }, { status: 404 });
		}

		// สร้างการมอบหมาย
		const assignmentId = db_helpers.createAssignment({
			machinery_id: parseInt(id),
			project_id,
			assigned_date,
			return_date,
			status: 'ASSIGNED',
			notes,
		});

		return NextResponse.json(
			{ success: true, message: 'มอบหมายเครื่องจักรสำเร็จ', assignmentId },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Assign machinery error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการมอบหมายเครื่องจักร' },
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
		const { assignment_id, ...updateData } = body;

		if (!assignment_id) {
			return NextResponse.json(
				{ error: 'กรุณาระบุ assignment_id' },
				{ status: 400 }
			);
		}

		db_helpers.updateAssignment(assignment_id, updateData);

		return NextResponse.json({
			success: true,
			message: 'อัปเดตการมอบหมายสำเร็จ',
		});
	} catch (error) {
		console.error('Update assignment error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการอัปเดตการมอบหมาย' },
			{ status: 500 }
		);
	}
}
