import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function GET(request: NextRequest) {
	try {
		const teams = db_helpers.getAllTeams();
		return NextResponse.json({ success: true, data: teams });
	} catch (error) {
		console.error('Get teams error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลทีม' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, description } = body;

		// Validate
		if (!name) {
			return NextResponse.json({ error: 'กรุณากรอกชื่อทีม' }, { status: 400 });
		}

		const id = db_helpers.createTeam({ name, description });
		const team = db_helpers.getTeamById(id);

		return NextResponse.json({ success: true, data: team }, { status: 201 });
	} catch (error) {
		console.error('Create team error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการสร้างทีม' },
			{ status: 500 }
		);
	}
}
