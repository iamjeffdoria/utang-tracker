import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  fullName: text('full_name').notNull(),
  lastName: text('last_name'),
  createdAt: text('created_at').notNull(),
})

export const debts = sqliteTable('debts', {
  id: text('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  contactId: text('contact_id').notNull().references(() => contacts.id),
  amount: text('amount').notNull(),         // stored as string e.g. "500.00"
  type: text('type').notNull(),             // "lender" | "borrower"
  notes: text('notes'),
  dueDate: text('due_date'),
  status: text('status').notNull(),         // "unpaid" | "paid"
  createdAt: text('created_at').notNull(),
})

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  clerkId: text('clerk_id').notNull(),
  type: text('type').notNull(),        // 'due' | 'paid' | 'overdue' | 'reminder' | 'new'
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: text('read').notNull(),        // 'true' | 'false' (SQLite has no boolean)
  createdAt: text('created_at').notNull(),
})