import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const team = db_helpers.getTeamById(parseInt(id));

		if (!team) {
			return NextResponse.json({ error: 'ไม่พบทีม' }, { status: 404 });
		}

		// ดึงรายชื่อพนักงานในทีม
		const employees = db_helpers.getAllEmployees(parseInt(id));

		return NextResponse.json({
			success: true,
			data: {
				...team,
				employees,
			},
		});
	} catch (error) {
		console.error('Get team error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลทีม' },
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

		const team = db_helpers.getTeamById(parseInt(id));
		if (!team) {
			return NextResponse.json({ error: 'ไม่พบทีม' }, { status: 404 });
		}

		db_helpers.updateTeam(parseInt(id), body);
		const updatedTeam = db_helpers.getTeamById(parseInt(id));

		return NextResponse.json({ success: true, data: updatedTeam });
	} catch (error) {
		console.error('Update team error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการแก้ไขทีม' },
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
		const team = db_helpers.getTeamById(parseInt(id));

		if (!team) {
			return NextResponse.json({ error: 'ไม่พบทีม' }, { status: 404 });
		}

		db_helpers.deleteTeam(parseInt(id));
		return NextResponse.json({ success: true, message: 'ลบทีมสำเร็จ' });
	} catch (error) {
		console.error('Delete team error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการลบทีม' },
			{ status: 500 }
		);
	}
}
