import { db } from './index'

export async function runMigrations() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY NOT NULL,
      clerk_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      last_name TEXT,
      created_at TEXT NOT NULL
    )
  `)
   console.log('Migrations ran ✅')

  await db.run(`
    CREATE TABLE IF NOT EXISTS debts (
      id TEXT PRIMARY KEY NOT NULL,
      clerk_id TEXT NOT NULL,
      contact_id TEXT NOT NULL REFERENCES contacts(id),
      amount TEXT NOT NULL,
      type TEXT NOT NULL,
      notes TEXT,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'unpaid',
      created_at TEXT NOT NULL
    )
  `)
  console.log('Migrations ran ✅')

  await db.run(`
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY NOT NULL,
    clerk_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read TEXT NOT NULL DEFAULT 'false',
    created_at TEXT NOT NULL
  )
`)

  await db.run(`
    CREATE TABLE IF NOT EXISTS onboarding (
      id TEXT PRIMARY KEY NOT NULL,
      clerk_id TEXT NOT NULL UNIQUE,
      completed TEXT NOT NULL DEFAULT 'false',
      current_step TEXT NOT NULL DEFAULT '0',
      completed_at TEXT,
      created_at TEXT NOT NULL
    )
  `)
  console.log('Migrations ran ✅')

}
