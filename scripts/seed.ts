// Seed script สำหรับเพิ่มข้อมูลเริ่มต้น
import { db_helpers } from '../src/lib/db';

async function seed() {
	try {
		console.log('Starting seed data...');

		// สร้างโครงการตัวอย่าง
		console.log('Creating projects...');
		const projects = [
			{
				name: 'โครงการซ่อมแซมถนนสายบ้านโนนสว่าง',
				description: 'ซ่อมแซมถนนและทางเท้าในตำบลบ้านโนนสว่าง',
				location: 'ตำบลบ้านโนนสว่าง อำเภอเมืองอุดรธานี',
				latitude: 17.4239,
				longitude: 102.8072,
				start_date: '2025-01-01',
				end_date: '2025-06-30',
				status: 'IN_PROGRESS' as const,
			},
			{
				name: 'โครงการก่อสร้างสะพานข้ามลำน้ำหมัน',
				description: 'ก่อสร้างสะพานคอนกรีตเสริมเหล็กข้ามลำน้ำหมัน',
				location: 'ตำบลหนองบัว อำเภอหนองวัวซอ',
				latitude: 17.1667,
				longitude: 102.5833,
				start_date: '2025-02-15',
				end_date: '2025-12-31',
				status: 'PLANNING' as const,
			},
			{
				name: 'โครงการปรับปรุงระบบระบายน้ำเมืองอุดรธานี',
				description: 'ขุดลอกและปรับปรุงระบบระบายน้ำในเขตเทศบาล',
				location: 'เทศบาลเมืองอุดรธานี',
				latitude: 17.4139,
				longitude: 102.7872,
				start_date: '2024-10-01',
				end_date: '2025-03-31',
				status: 'IN_PROGRESS' as const,
			},
			{
				name: 'โครงการก่อสร้างลานกีฬาหมู่บ้าน',
				description: 'สร้างลานกีฬาอเนกประสงค์พร้อมสนามบาสเก็ตบอล',
				location: 'ตำบลบ้านจั่น อำเภอกุมภวาปี',
				latitude: 17.1333,
				longitude: 103.0833,
				start_date: '2024-08-01',
				end_date: '2024-12-31',
				status: 'COMPLETED' as const,
			},
		];

		const projectIds = [];
		for (const project of projects) {
			const id = db_helpers.createProject(project);
			projectIds.push(id);
			console.log(`✓ Created project: ${project.name}`);
		}

		// สร้างทีมงาน
		console.log('\nCreating teams...');
		const teams = [
			{
				name: 'ทีมซ่อมบำรุงถนน',
				description: 'รับผิดชอบงานซ่อมแซมและบำรุงรักษาถนน',
			},
			{
				name: 'ทีมก่อสร้าง',
				description: 'รับผิดชอบงานก่อสร้างโครงสร้างพื้นฐาน',
			},
			{
				name: 'ทีมระบายน้ำ',
				description: 'รับผิดชอบงานระบบระบายน้ำและบำบัดน้ำเสีย',
			},
		];

		const teamIds = [];
		for (const team of teams) {
			const id = db_helpers.createTeam(team);
			teamIds.push(id);
			console.log(`✓ Created team: ${team.name}`);
		}

		// สร้างพนักงาน
		console.log('\nCreating employees...');
		const employees = [
			{
				code: 'EMP001',
				first_name: 'สมชาย',
				last_name: 'ใจดี',
				position: 'หัวหน้าทีม',
				phone: '081-234-5678',
				team_id: teamIds[0],
			},
			{
				code: 'EMP002',
				first_name: 'สมศรี',
				last_name: 'มั่นคง',
				position: 'วิศวกร',
				phone: '082-345-6789',
				team_id: teamIds[0],
			},
			{
				code: 'EMP003',
				first_name: 'วิชัย',
				last_name: 'เพียรพยาด',
				position: 'หัวหน้าทีม',
				phone: '083-456-7890',
				team_id: teamIds[1],
			},
			{
				code: 'EMP004',
				first_name: 'ประภา',
				last_name: 'สว่างวงษ์',
				position: 'ช่างเทคนิค',
				phone: '084-567-8901',
				team_id: teamIds[1],
			},
			{
				code: 'EMP005',
				first_name: 'สุรชัย',
				last_name: 'แข็งแรง',
				position: 'หัวหน้าทีม',
				phone: '085-678-9012',
				team_id: teamIds[2],
			},
			{
				code: 'EMP006',
				first_name: 'นภา',
				last_name: 'สุขสบาย',
				position: 'ผู้ช่วยวิศวกร',
				phone: '086-789-0123',
				team_id: teamIds[2],
			},
		];

		for (const employee of employees) {
			db_helpers.createEmployee(employee);
			console.log(
				`✓ Created employee: ${employee.first_name} ${employee.last_name}`
			);
		}

		// สร้างเครื่องจักร
		console.log('\nCreating machinery...');
		const machineryList = [
			{
				code: 'BH-001',
				name: 'รถขุดแบคโฮ KOMATSU PC200',
				type: 'รถแบคโฮ',
				brand: 'KOMATSU',
				model: 'PC200-8',
				year: 2020,
				status: 'AVAILABLE' as const,
				notes: 'สภาพดี บำรุงรักษาเป็นประจำ',
			},
			{
				code: 'BH-002',
				name: 'รถขุดแบคโฮ HITACHI ZX200',
				type: 'รถแบคโฮ',
				brand: 'HITACHI',
				model: 'ZX200-3',
				year: 2019,
				status: 'IN_USE' as const,
				notes: 'กำลังใช้งานในโครงการ',
			},
			{
				code: 'RD-001',
				name: 'รถบดล้อเหล็ก SAKAI SW350',
				type: 'รถบด',
				brand: 'SAKAI',
				model: 'SW350-1',
				year: 2021,
				status: 'AVAILABLE' as const,
				notes: 'เพิ่งซื้อใหม่',
			},
			{
				code: 'RD-002',
				name: 'รถบดล้อยาง DYNAPAC CA250',
				type: 'รถบด',
				brand: 'DYNAPAC',
				model: 'CA250D',
				year: 2018,
				status: 'MAINTENANCE' as const,
				notes: 'อยู่ระหว่างซ่อมบำรุง',
			},
			{
				code: 'GR-001',
				name: 'รถเกรด CAT 140M',
				type: 'รถเกรดเดอร์',
				brand: 'CATERPILLAR',
				model: '140M',
				year: 2020,
				status: 'IN_USE' as const,
				notes: 'ใช้งานโครงการซ่อมถนน',
			},
			{
				code: 'TR-001',
				name: 'รถบรรทุก HINO 6 ล้อ',
				type: 'รถบรรทุก',
				brand: 'HINO',
				model: 'FC9JLTA',
				year: 2019,
				status: 'AVAILABLE' as const,
				notes: 'ใช้ขนวัสดุ',
			},
			{
				code: 'TR-002',
				name: 'รถบรรทุก ISUZU 10 ล้อ',
				type: 'รถบรรทุก',
				brand: 'ISUZU',
				model: 'FVM34W',
				year: 2020,
				status: 'AVAILABLE' as const,
				notes: 'ใช้ขนวัสดุหนัก',
			},
			{
				code: 'EX-001',
				name: 'รถขุดตีนตะขาบ KOBELCO SK75',
				type: 'รถขุดเล็ก',
				brand: 'KOBELCO',
				model: 'SK75SR-3',
				year: 2021,
				status: 'AVAILABLE' as const,
				notes: 'เหมาะกับพื้นที่แคบ',
			},
		];

		const machineryIds = [];
		for (const machinery of machineryList) {
			const id = db_helpers.createMachinery(machinery);
			machineryIds.push(id);
			console.log(`✓ Created machinery: ${machinery.name}`);
		}

		// สร้างการมอบหมายเครื่องจักร
		console.log('\nCreating machinery assignments...');
		const assignments = [
			{
				machinery_id: machineryIds[1], // BH-002
				project_id: projectIds[0], // โครงการซ่อมถนนบ้านโนนสว่าง
				assigned_date: '2025-01-05',
				return_date: '2025-06-30',
				status: 'ASSIGNED' as const,
				notes: 'ใช้ขุดและปรับพื้นที่',
			},
			{
				machinery_id: machineryIds[4], // GR-001
				project_id: projectIds[0], // โครงการซ่อมถนนบ้านโนนสว่าง
				assigned_date: '2025-01-10',
				return_date: '2025-06-30',
				status: 'ASSIGNED' as const,
				notes: 'ใช้ปรับระดับถนน',
			},
		];

		for (const assignment of assignments) {
			db_helpers.createAssignment(assignment);
			console.log(
				`✓ Created assignment: Machinery ${assignment.machinery_id} -> Project ${assignment.project_id}`
			);
		}

		console.log('\n✅ Seed data completed successfully!');
		console.log('\nSummary:');
		console.log(`- Projects: ${projects.length}`);
		console.log(`- Teams: ${teams.length}`);
		console.log(`- Employees: ${employees.length}`);
		console.log(`- Machinery: ${machineryList.length}`);
		console.log(`- Assignments: ${assignments.length}`);
	} catch (error) {
		console.error('Error seeding data:', error);
		throw error;
	}
}

seed()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
