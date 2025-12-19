import { NextRequest, NextResponse } from 'next/server';
import { db_helpers } from '@/lib/db';

export async function GET(request: NextRequest) {
	try {
		const projects = db_helpers.getAllProjects();
		return NextResponse.json({ success: true, data: projects });
	} catch (error) {
		console.error('Get projects error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			name,
			description,
			location,
			latitude,
			longitude,
			start_date,
			end_date,
			status,
		} = body;

		// Validate
		if (!name) {
			return NextResponse.json(
				{ error: 'กรุณากรอกชื่อโครงการ' },
				{ status: 400 }
			);
		}

		const id = db_helpers.createProject({
			name,
			description,
			location,
			latitude,
			longitude,
			start_date,
			end_date,
			status: status || 'PLANNING',
		});

		const project = db_helpers.getProjectById(id);
		return NextResponse.json({ success: true, data: project }, { status: 201 });
	} catch (error) {
		console.error('Create project error:', error);
		return NextResponse.json(
			{ error: 'เกิดข้อผิดพลาดในการสร้างโครงการ' },
			{ status: 500 }
		);
	}
}
