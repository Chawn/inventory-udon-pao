import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';

// Types
export interface User {
	id: number;
	username: string;
	password_hash: string;
	full_name: string;
	created_at: string;
}

export interface Project {
	id: number;
	name: string;
	description?: string;
	location?: string;
	latitude?: number;
	longitude?: number;
	start_date?: string;
	end_date?: string;
	status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
	created_at: string;
	updated_at: string;
}

export interface Machinery {
	id: number;
	code: string;
	name: string;
	type: string;
	brand?: string;
	model?: string;
	year?: number;
	status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
	notes?: string;
	created_at: string;
	updated_at: string;
}

export interface Team {
	id: number;
	name: string;
	description?: string;
	created_at: string;
	updated_at: string;
}

export interface Employee {
	id: number;
	code: string;
	first_name: string;
	last_name: string;
	position?: string;
	phone?: string;
	team_id?: number;
	created_at: string;
	updated_at: string;
}

export interface MachineryAssignment {
	id: number;
	machinery_id: number;
	project_id: number;
	assigned_date: string;
	return_date?: string;
	status: 'ASSIGNED' | 'RETURNED' | 'CANCELLED';
	notes?: string;
	created_at: string;
	updated_at: string;
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
	if (!db) {
		const dbPath = process.env.DATABASE_PATH || './database/inventory.db';
		db = new Database(dbPath);
		db.pragma('journal_mode = WAL');
		db.pragma('foreign_keys = ON');
	}
	return db;
}

export async function initDatabase() {
	const database = getDb();

	// อ่าน schema file
	const schemaPath = join(process.cwd(), 'database', 'schema.sql');
	const schema = readFileSync(schemaPath, 'utf-8');

	// Execute ทั้งไฟล์
	try {
		database.exec(schema);
		console.log('✓ Database schema created');
	} catch (error) {
		console.error('Error executing schema:', error);
		throw error;
	}

	// สร้าง admin user ถ้ายังไม่มี
	const adminExists = database
		.prepare('SELECT id FROM users WHERE username = ?')
		.get('admin');

	if (!adminExists) {
		const passwordHash = await bcrypt.hash('admin123', 10);
		database
			.prepare(
				'INSERT INTO users (username, password_hash, full_name) VALUES (?, ?, ?)'
			)
			.run('admin', passwordHash, 'ผู้ดูแลระบบ');
		console.log('✓ Admin user created (username: admin, password: admin123)');
	}

	console.log('✓ Database initialized successfully');
}

// Helper functions สำหรับ CRUD operations
export const db_helpers = {
	// Users
	getUserByUsername: (username: string): User | undefined => {
		return getDb()
			.prepare('SELECT * FROM users WHERE username = ?')
			.get(username) as User | undefined;
	},

	// Projects
	getAllProjects: (): Project[] => {
		return getDb()
			.prepare('SELECT * FROM projects ORDER BY created_at DESC')
			.all() as Project[];
	},

	getProjectById: (id: number): Project | undefined => {
		return getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id) as
			| Project
			| undefined;
	},

	createProject: (
		data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
	): number => {
		const result = getDb()
			.prepare(
				`
      INSERT INTO projects (name, description, location, latitude, longitude, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
			)
			.run(
				data.name,
				data.description || null,
				data.location || null,
				data.latitude || null,
				data.longitude || null,
				data.start_date || null,
				data.end_date || null,
				data.status || 'PLANNING'
			);
		return result.lastInsertRowid as number;
	},

	updateProject: (
		id: number,
		data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
	): void => {
		const fields = Object.keys(data)
			.map(key => `${key} = ?`)
			.join(', ');
		const values = [...Object.values(data), new Date().toISOString(), id];
		getDb()
			.prepare(`UPDATE projects SET ${fields}, updated_at = ? WHERE id = ?`)
			.run(...values);
	},

	deleteProject: (id: number): void => {
		getDb().prepare('DELETE FROM projects WHERE id = ?').run(id);
	},

	// Machinery
	getAllMachinery: (statusFilter?: string): Machinery[] => {
		if (statusFilter) {
			return getDb()
				.prepare(
					'SELECT * FROM machinery WHERE status = ? ORDER BY created_at DESC'
				)
				.all(statusFilter) as Machinery[];
		}
		return getDb()
			.prepare('SELECT * FROM machinery ORDER BY created_at DESC')
			.all() as Machinery[];
	},

	getMachineryById: (id: number): Machinery | undefined => {
		return getDb().prepare('SELECT * FROM machinery WHERE id = ?').get(id) as
			| Machinery
			| undefined;
	},

	createMachinery: (
		data: Omit<Machinery, 'id' | 'created_at' | 'updated_at'>
	): number => {
		const result = getDb()
			.prepare(
				`
      INSERT INTO machinery (code, name, type, brand, model, year, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
			)
			.run(
				data.code,
				data.name,
				data.type,
				data.brand || null,
				data.model || null,
				data.year || null,
				data.status || 'AVAILABLE',
				data.notes || null
			);
		return result.lastInsertRowid as number;
	},

	updateMachinery: (
		id: number,
		data: Partial<Omit<Machinery, 'id' | 'created_at' | 'updated_at'>>
	): void => {
		const fields = Object.keys(data)
			.map(key => `${key} = ?`)
			.join(', ');
		const values = [...Object.values(data), new Date().toISOString(), id];
		getDb()
			.prepare(`UPDATE machinery SET ${fields}, updated_at = ? WHERE id = ?`)
			.run(...values);
	},

	deleteMachinery: (id: number): void => {
		getDb().prepare('DELETE FROM machinery WHERE id = ?').run(id);
	},

	// Teams
	getAllTeams: (): Team[] => {
		return getDb()
			.prepare('SELECT * FROM teams ORDER BY created_at DESC')
			.all() as Team[];
	},

	getTeamById: (id: number): Team | undefined => {
		return getDb().prepare('SELECT * FROM teams WHERE id = ?').get(id) as
			| Team
			| undefined;
	},

	createTeam: (
		data: Omit<Team, 'id' | 'created_at' | 'updated_at'>
	): number => {
		const result = getDb()
			.prepare(
				`
      INSERT INTO teams (name, description)
      VALUES (?, ?)
    `
			)
			.run(data.name, data.description || null);
		return result.lastInsertRowid as number;
	},

	updateTeam: (
		id: number,
		data: Partial<Omit<Team, 'id' | 'created_at' | 'updated_at'>>
	): void => {
		const fields = Object.keys(data)
			.map(key => `${key} = ?`)
			.join(', ');
		const values = [...Object.values(data), new Date().toISOString(), id];
		getDb()
			.prepare(`UPDATE teams SET ${fields}, updated_at = ? WHERE id = ?`)
			.run(...values);
	},

	deleteTeam: (id: number): void => {
		getDb().prepare('DELETE FROM teams WHERE id = ?').run(id);
	},

	// Employees
	getAllEmployees: (teamIdFilter?: number): Employee[] => {
		if (teamIdFilter) {
			return getDb()
				.prepare(
					'SELECT * FROM employees WHERE team_id = ? ORDER BY created_at DESC'
				)
				.all(teamIdFilter) as Employee[];
		}
		return getDb()
			.prepare('SELECT * FROM employees ORDER BY created_at DESC')
			.all() as Employee[];
	},

	getEmployeeById: (id: number): Employee | undefined => {
		return getDb().prepare('SELECT * FROM employees WHERE id = ?').get(id) as
			| Employee
			| undefined;
	},

	createEmployee: (
		data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>
	): number => {
		const result = getDb()
			.prepare(
				`
      INSERT INTO employees (code, first_name, last_name, position, phone, team_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `
			)
			.run(
				data.code,
				data.first_name,
				data.last_name,
				data.position || null,
				data.phone || null,
				data.team_id || null
			);
		return result.lastInsertRowid as number;
	},

	updateEmployee: (
		id: number,
		data: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>
	): void => {
		const fields = Object.keys(data)
			.map(key => `${key} = ?`)
			.join(', ');
		const values = [...Object.values(data), new Date().toISOString(), id];
		getDb()
			.prepare(`UPDATE employees SET ${fields}, updated_at = ? WHERE id = ?`)
			.run(...values);
	},

	deleteEmployee: (id: number): void => {
		getDb().prepare('DELETE FROM employees WHERE id = ?').run(id);
	},

	// Machinery Assignments
	getAllAssignments: (): MachineryAssignment[] => {
		return getDb()
			.prepare('SELECT * FROM machinery_assignments ORDER BY created_at DESC')
			.all() as MachineryAssignment[];
	},

	getAssignmentsByMachinery: (machineryId: number): MachineryAssignment[] => {
		return getDb()
			.prepare(
				'SELECT * FROM machinery_assignments WHERE machinery_id = ? ORDER BY created_at DESC'
			)
			.all(machineryId) as MachineryAssignment[];
	},

	getAssignmentsByProject: (projectId: number): MachineryAssignment[] => {
		return getDb()
			.prepare(
				'SELECT * FROM machinery_assignments WHERE project_id = ? ORDER BY created_at DESC'
			)
			.all(projectId) as MachineryAssignment[];
	},

	createAssignment: (
		data: Omit<MachineryAssignment, 'id' | 'created_at' | 'updated_at'>
	): number => {
		const result = getDb()
			.prepare(
				`
      INSERT INTO machinery_assignments (machinery_id, project_id, assigned_date, return_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `
			)
			.run(
				data.machinery_id,
				data.project_id,
				data.assigned_date,
				data.return_date || null,
				data.status || 'ASSIGNED',
				data.notes || null
			);

		// อัปเดตสถานะเครื่องจักรเป็น IN_USE
		getDb()
			.prepare('UPDATE machinery SET status = ?, updated_at = ? WHERE id = ?')
			.run('IN_USE', new Date().toISOString(), data.machinery_id);

		return result.lastInsertRowid as number;
	},

	updateAssignment: (
		id: number,
		data: Partial<Omit<MachineryAssignment, 'id' | 'created_at' | 'updated_at'>>
	): void => {
		const fields = Object.keys(data)
			.map(key => `${key} = ?`)
			.join(', ');
		const values = [...Object.values(data), new Date().toISOString(), id];
		getDb()
			.prepare(
				`UPDATE machinery_assignments SET ${fields}, updated_at = ? WHERE id = ?`
			)
			.run(...values);

		// ถ้าเปลี่ยนสถานะเป็น RETURNED หรือ CANCELLED ให้เปลี่ยนสถานะเครื่องจักรเป็น AVAILABLE
		if (data.status === 'RETURNED' || data.status === 'CANCELLED') {
			const assignment = getDb()
				.prepare('SELECT machinery_id FROM machinery_assignments WHERE id = ?')
				.get(id) as MachineryAssignment;
			getDb()
				.prepare('UPDATE machinery SET status = ?, updated_at = ? WHERE id = ?')
				.run('AVAILABLE', new Date().toISOString(), assignment.machinery_id);
		}
	},

	deleteAssignment: (id: number): void => {
		getDb().prepare('DELETE FROM machinery_assignments WHERE id = ?').run(id);
	},
};
