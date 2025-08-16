import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  numeric, 
  integer, 
  boolean, 
  pgEnum 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'security_officer', 'driver']);
export const alertPriorityEnum = pgEnum('alert_priority', ['low', 'medium', 'high', 'critical']);
export const alertTypeEnum = pgEnum('alert_type', ['route_deviation', 'geofence_breach', 'health_risk', 'device_offline', 'panic_button']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  full_name: text('full_name').notNull(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// People (Security Officers and Drivers) table
export const peopleTable = pgTable('people', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  employee_id: text('employee_id').notNull().unique(),
  phone: text('phone'),
  emergency_contact: text('emergency_contact'),
  assigned_device_id: text('assigned_device_id'),
  is_on_duty: boolean('is_on_duty').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Geofences table
export const geofencesTable = pgTable('geofences', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  center_lat: numeric('center_lat', { precision: 10, scale: 8 }).notNull(),
  center_lng: numeric('center_lng', { precision: 11, scale: 8 }).notNull(),
  radius_meters: integer('radius_meters').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Routes table
export const routesTable = pgTable('routes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  waypoints: text('waypoints').notNull(), // JSON string of coordinates
  geofence_ids: text('geofence_ids'), // JSON string of geofence IDs
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// GPS Locations table
export const gpsLocationsTable = pgTable('gps_locations', {
  id: serial('id').primaryKey(),
  person_id: integer('person_id').notNull().references(() => peopleTable.id, { onDelete: 'cascade' }),
  latitude: numeric('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: numeric('longitude', { precision: 11, scale: 8 }).notNull(),
  altitude: numeric('altitude', { precision: 8, scale: 2 }),
  accuracy: numeric('accuracy', { precision: 8, scale: 2 }),
  speed: numeric('speed', { precision: 8, scale: 2 }),
  heading: numeric('heading', { precision: 6, scale: 3 }),
  timestamp: timestamp('timestamp').notNull(),
  device_id: text('device_id'),
  is_synced: boolean('is_synced').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Health Data table
export const healthDataTable = pgTable('health_data', {
  id: serial('id').primaryKey(),
  person_id: integer('person_id').notNull().references(() => peopleTable.id, { onDelete: 'cascade' }),
  heart_rate: integer('heart_rate'),
  spo2: integer('spo2'),
  deep_sleep_minutes: integer('deep_sleep_minutes'),
  stress_level: integer('stress_level'), // 0-100 scale
  timestamp: timestamp('timestamp').notNull(),
  device_id: text('device_id'),
  is_synced: boolean('is_synced').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Alerts table
export const alertsTable = pgTable('alerts', {
  id: serial('id').primaryKey(),
  person_id: integer('person_id').notNull().references(() => peopleTable.id, { onDelete: 'cascade' }),
  alert_type: alertTypeEnum('alert_type').notNull(),
  priority: alertPriorityEnum('priority').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  recommended_action: text('recommended_action'),
  metadata: text('metadata'), // JSON string for additional data
  is_acknowledged: boolean('is_acknowledged').notNull().default(false),
  acknowledged_by: integer('acknowledged_by').references(() => usersTable.id),
  acknowledged_at: timestamp('acknowledged_at'),
  resolved_at: timestamp('resolved_at'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Audit Logs table
export const auditLogsTable = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id),
  action: text('action').notNull(),
  resource_type: text('resource_type').notNull(),
  resource_id: text('resource_id'),
  old_values: text('old_values'), // JSON string
  new_values: text('new_values'), // JSON string
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull()
});

// Consent Management table
export const consentsTable = pgTable('consents', {
  id: serial('id').primaryKey(),
  person_id: integer('person_id').notNull().references(() => peopleTable.id, { onDelete: 'cascade' }),
  consent_type: text('consent_type').notNull(), // 'gps_tracking', 'health_monitoring', 'data_processing'
  is_granted: boolean('is_granted').notNull(),
  granted_at: timestamp('granted_at'),
  revoked_at: timestamp('revoked_at'),
  expiry_date: timestamp('expiry_date'),
  legal_basis: text('legal_basis'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Device Sync Status table
export const deviceSyncTable = pgTable('device_sync', {
  id: serial('id').primaryKey(),
  device_id: text('device_id').notNull().unique(),
  person_id: integer('person_id').notNull().references(() => peopleTable.id, { onDelete: 'cascade' }),
  last_sync: timestamp('last_sync'),
  pending_records: integer('pending_records').notNull().default(0),
  is_online: boolean('is_online').notNull().default(false),
  battery_level: integer('battery_level'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  person: one(peopleTable, {
    fields: [usersTable.id],
    references: [peopleTable.user_id],
  }),
  acknowledgedAlerts: many(alertsTable, {
    relationName: 'acknowledgedBy'
  }),
  auditLogs: many(auditLogsTable)
}));

export const peopleRelations = relations(peopleTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [peopleTable.user_id],
    references: [usersTable.id],
  }),
  gpsLocations: many(gpsLocationsTable),
  healthData: many(healthDataTable),
  alerts: many(alertsTable),
  consents: many(consentsTable),
  deviceSync: many(deviceSyncTable)
}));

export const gpsLocationsRelations = relations(gpsLocationsTable, ({ one }) => ({
  person: one(peopleTable, {
    fields: [gpsLocationsTable.person_id],
    references: [peopleTable.id],
  })
}));

export const healthDataRelations = relations(healthDataTable, ({ one }) => ({
  person: one(peopleTable, {
    fields: [healthDataTable.person_id],
    references: [peopleTable.id],
  })
}));

export const alertsRelations = relations(alertsTable, ({ one }) => ({
  person: one(peopleTable, {
    fields: [alertsTable.person_id],
    references: [peopleTable.id],
  }),
  acknowledgedByUser: one(usersTable, {
    fields: [alertsTable.acknowledged_by],
    references: [usersTable.id],
    relationName: 'acknowledgedBy'
  })
}));

export const auditLogsRelations = relations(auditLogsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [auditLogsTable.user_id],
    references: [usersTable.id],
  })
}));

export const consentsRelations = relations(consentsTable, ({ one }) => ({
  person: one(peopleTable, {
    fields: [consentsTable.person_id],
    references: [peopleTable.id],
  })
}));

export const deviceSyncRelations = relations(deviceSyncTable, ({ one }) => ({
  person: one(peopleTable, {
    fields: [deviceSyncTable.person_id],
    references: [peopleTable.id],
  })
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Person = typeof peopleTable.$inferSelect;
export type NewPerson = typeof peopleTable.$inferInsert;
export type Geofence = typeof geofencesTable.$inferSelect;
export type NewGeofence = typeof geofencesTable.$inferInsert;
export type Route = typeof routesTable.$inferSelect;
export type NewRoute = typeof routesTable.$inferInsert;
export type GpsLocation = typeof gpsLocationsTable.$inferSelect;
export type NewGpsLocation = typeof gpsLocationsTable.$inferInsert;
export type HealthData = typeof healthDataTable.$inferSelect;
export type NewHealthData = typeof healthDataTable.$inferInsert;
export type Alert = typeof alertsTable.$inferSelect;
export type NewAlert = typeof alertsTable.$inferInsert;
export type AuditLog = typeof auditLogsTable.$inferSelect;
export type NewAuditLog = typeof auditLogsTable.$inferInsert;
export type Consent = typeof consentsTable.$inferSelect;
export type NewConsent = typeof consentsTable.$inferInsert;
export type DeviceSync = typeof deviceSyncTable.$inferSelect;
export type NewDeviceSync = typeof deviceSyncTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  people: peopleTable,
  geofences: geofencesTable,
  routes: routesTable,
  gpsLocations: gpsLocationsTable,
  healthData: healthDataTable,
  alerts: alertsTable,
  auditLogs: auditLogsTable,
  consents: consentsTable,
  deviceSync: deviceSyncTable
};