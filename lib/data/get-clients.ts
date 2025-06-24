// lib/data/get-clients.ts
import pool from '@/lib/db';

export async function getClients(userId: string) {
  const result = await pool.query(
    'SELECT * FROM customers WHERE created_by = $1',
    [userId]
  );
  return result.rows;
}