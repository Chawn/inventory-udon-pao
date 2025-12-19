// Script สำหรับ initialize database
import { initDatabase } from '../src/lib/db';

async function main() {
	try {
		console.log('Initializing database...');
		await initDatabase();
		console.log('Database initialization completed!');
		process.exit(0);
	} catch (error) {
		console.error('Error initializing database:', error);
		process.exit(1);
	}
}

main();
