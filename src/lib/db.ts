// lib/db.ts
// MySQL connection pool — imported by all API routes.
// Never import this in client components ('use client' files).

import mysql from 'mysql2/promise';

// Read from environment variables (.env.local).
// Defaults match a fresh XAMPP installation.
const pool = mysql.createPool({
  host:               process.env.DB_HOST     ?? 'localhost',
  port:               Number(process.env.DB_PORT ?? 3306),
  user:               process.env.DB_USER     ?? 'root',
  password:           process.env.DB_PASSWORD ?? '',
  database:           process.env.DB_NAME     ?? 'zen_journeys',
  waitForConnections: true,
  connectionLimit:    10,       
  queueLimit:         0,
  charset:            'utf8mb4',
});

export default pool;