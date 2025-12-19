import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const project = db_helpers.getProjectById(parseInt(id));

		if (!project) {
			return NextResponse.json({ error: 'ไม่พบโครงการ' }, { status: 404 });
		}

		// ดึงรายการเครื่องจักรที่ใช้ในโครงการนี้
		const assignments = db_helpers.getAssignmentsByProject(parseInt(id));

		return NextResponse.json({
			success: true,
			data: {
				...project,
				assignments,
			},
		});
	} catch (error) {
		console.error('Get project error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ' },
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

		const project = db_helpers.getProjectById(parseInt(id));
		if (!project) {
			return NextResponse.json({ error: 'ไม่พบโครงการ' }, { status: 404 });
		}

		db_helpers.updateProject(parseInt(id), body);
		const updatedProject = db_helpers.getProjectById(parseInt(id));

		return NextResponse.json({ success: true, data: updatedProject });
	} catch (error) {
		console.error('Update project error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการแก้ไขโครงการ' },
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
		const project = db_helpers.getProjectById(parseInt(id));

		if (!project) {
			return NextResponse.json({ error: 'ไม่พบโครงการ' }, { status: 404 });
		}

		db_helpers.deleteProject(parseInt(id));
		return NextResponse.json({ success: true, message: 'ลบโครงการสำเร็จ' });
	} catch (error) {
		console.error('Delete project error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการลบโครงการ' },
			{ status: 500 }
		);
	}
}
