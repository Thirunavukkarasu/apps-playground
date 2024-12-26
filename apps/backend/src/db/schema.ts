import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// Templates table
export const templates = sqliteTable('templates', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    bucketUrl: text('bucket_url'), // URL for the JSON file in the bucket
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// Assignments table
export const assignments = sqliteTable('assignments', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    templateId: integer('template_id').references(() => templates.id),
    bucketUrl: text('bucket_url'), // URL for the JSON file in the bucket
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// Assignment attempts table
export const assignmentAttempts = sqliteTable('assignment_attempts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    assignmentId: integer('assignment_id').notNull().references(() => assignments.id),
    userId: integer('user_id').notNull().references(() => users.id),
    status: text('status').notNull(), // e.g., 'submitted', 'graded'
    score: integer('score'),
    feedback: text('feedback'),
    bucketUrl: text('bucket_url'), // URL for the JSON file in the bucket
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    assignmentAttempts: many(assignmentAttempts),
}));

export const templatesRelations = relations(templates, ({ many }) => ({
    assignments: many(assignments),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
    template: one(templates, {
        fields: [assignments.templateId],
        references: [templates.id],
    }),
    attempts: many(assignmentAttempts),
}));

export const assignmentAttemptsRelations = relations(assignmentAttempts, ({ one }) => ({
    assignment: one(assignments, {
        fields: [assignmentAttempts.assignmentId],
        references: [assignments.id],
    }),
    user: one(users, {
        fields: [assignmentAttempts.userId],
        references: [users.id],
    }),
}));

