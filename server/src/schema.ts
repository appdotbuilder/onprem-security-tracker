import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['admin', 'security_officer', 'driver']);
export type UserRole = z.infer<typeof userRoleSchema>;

// Alert priority enum
export const alertPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export type AlertPriority = z.infer<typeof alertPrioritySchema>;

// Alert type enum
export const alertTypeSchema = z.enum(['route_deviation', 'geofence_breach', 'health_risk', 'device_offline', 'panic_button']);
export type AlertType = z.infer<typeof alertTypeSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  full_name: z.string(),
  role: userRoleSchema,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Person (Security Officer or Driver) schema
export const personSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  employee_id: z.string(),
  phone: z.string().nullable(),
  emergency_contact: z.string().nullable(),
  assigned_device_id: z.string().nullable(),
  is_on_duty: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Person = z.infer<typeof personSchema>;

// Geofence schema
export const geofenceSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  center_lat: z.number(),
  center_lng: z.number(),
  radius_meters: z.number(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Geofence = z.infer<typeof geofenceSchema>;

// Route schema
export const routeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  waypoints: z.string(), // JSON string of coordinate array
  geofence_ids: z.string().nullable(), // JSON string of geofence IDs
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Route = z.infer<typeof routeSchema>;

// GPS Location schema
export const gpsLocationSchema = z.object({
  id: z.number(),
  person_id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().nullable(),
  accuracy: z.number().nullable(),
  speed: z.number().nullable(),
  heading: z.number().nullable(),
  timestamp: z.coerce.date(),
  device_id: z.string().nullable(),
  is_synced: z.boolean(),
  created_at: z.coerce.date()
});

export type GpsLocation = z.infer<typeof gpsLocationSchema>;

// Health Data schema
export const healthDataSchema = z.object({
  id: z.number(),
  person_id: z.number(),
  heart_rate: z.number().nullable(),
  spo2: z.number().nullable(),
  deep_sleep_minutes: z.number().nullable(),
  stress_level: z.number().nullable(), // 0-100 scale
  timestamp: z.coerce.date(),
  device_id: z.string().nullable(),
  is_synced: z.boolean(),
  created_at: z.coerce.date()
});

export type HealthData = z.infer<typeof healthDataSchema>;

// Alert schema
export const alertSchema = z.object({
  id: z.number(),
  person_id: z.number(),
  alert_type: alertTypeSchema,
  priority: alertPrioritySchema,
  title: z.string(),
  message: z.string(),
  recommended_action: z.string().nullable(),
  metadata: z.string().nullable(), // JSON string for additional data
  is_acknowledged: z.boolean(),
  acknowledged_by: z.number().nullable(),
  acknowledged_at: z.coerce.date().nullable(),
  resolved_at: z.coerce.date().nullable(),
  created_at: z.coerce.date()
});

export type Alert = z.infer<typeof alertSchema>;

// Audit Log schema
export const auditLogSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable(),
  action: z.string(),
  resource_type: z.string(),
  resource_id: z.string().nullable(),
  old_values: z.string().nullable(), // JSON string
  new_values: z.string().nullable(), // JSON string
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
  timestamp: z.coerce.date()
});

export type AuditLog = z.infer<typeof auditLogSchema>;

// Consent Management schema
export const consentSchema = z.object({
  id: z.number(),
  person_id: z.number(),
  consent_type: z.string(), // 'gps_tracking', 'health_monitoring', 'data_processing'
  is_granted: z.boolean(),
  granted_at: z.coerce.date().nullable(),
  revoked_at: z.coerce.date().nullable(),
  expiry_date: z.coerce.date().nullable(),
  legal_basis: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Consent = z.infer<typeof consentSchema>;

// Device sync status schema
export const deviceSyncSchema = z.object({
  id: z.number(),
  device_id: z.string(),
  person_id: z.number(),
  last_sync: z.coerce.date().nullable(),
  pending_records: z.number(),
  is_online: z.boolean(),
  battery_level: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type DeviceSync = z.infer<typeof deviceSyncSchema>;

// Input schemas for creating records
export const createUserInputSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password_hash: z.string(),
  full_name: z.string().min(1),
  role: userRoleSchema,
  is_active: z.boolean().optional()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createPersonInputSchema = z.object({
  user_id: z.number(),
  employee_id: z.string().min(1),
  phone: z.string().nullable().optional(),
  emergency_contact: z.string().nullable().optional(),
  assigned_device_id: z.string().nullable().optional(),
  is_on_duty: z.boolean().optional()
});

export type CreatePersonInput = z.infer<typeof createPersonInputSchema>;

export const createGeofenceInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  center_lat: z.number().min(-90).max(90),
  center_lng: z.number().min(-180).max(180),
  radius_meters: z.number().positive(),
  is_active: z.boolean().optional()
});

export type CreateGeofenceInput = z.infer<typeof createGeofenceInputSchema>;

export const createRouteInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  waypoints: z.string(), // JSON string
  geofence_ids: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export type CreateRouteInput = z.infer<typeof createRouteInputSchema>;

export const createGpsLocationInputSchema = z.object({
  person_id: z.number(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number().nullable().optional(),
  accuracy: z.number().nullable().optional(),
  speed: z.number().nullable().optional(),
  heading: z.number().min(0).max(360).nullable().optional(),
  timestamp: z.coerce.date(),
  device_id: z.string().nullable().optional(),
  is_synced: z.boolean().optional()
});

export type CreateGpsLocationInput = z.infer<typeof createGpsLocationInputSchema>;

export const createHealthDataInputSchema = z.object({
  person_id: z.number(),
  heart_rate: z.number().positive().nullable().optional(),
  spo2: z.number().min(0).max(100).nullable().optional(),
  deep_sleep_minutes: z.number().nonnegative().nullable().optional(),
  stress_level: z.number().min(0).max(100).nullable().optional(),
  timestamp: z.coerce.date(),
  device_id: z.string().nullable().optional(),
  is_synced: z.boolean().optional()
});

export type CreateHealthDataInput = z.infer<typeof createHealthDataInputSchema>;

export const createAlertInputSchema = z.object({
  person_id: z.number(),
  alert_type: alertTypeSchema,
  priority: alertPrioritySchema,
  title: z.string().min(1),
  message: z.string().min(1),
  recommended_action: z.string().nullable().optional(),
  metadata: z.string().nullable().optional()
});

export type CreateAlertInput = z.infer<typeof createAlertInputSchema>;

export const createConsentInputSchema = z.object({
  person_id: z.number(),
  consent_type: z.string().min(1),
  is_granted: z.boolean(),
  granted_at: z.coerce.date().nullable().optional(),
  expiry_date: z.coerce.date().nullable().optional(),
  legal_basis: z.string().nullable().optional()
});

export type CreateConsentInput = z.infer<typeof createConsentInputSchema>;

// Update schemas for modifying records
export const updatePersonInputSchema = z.object({
  id: z.number(),
  phone: z.string().nullable().optional(),
  emergency_contact: z.string().nullable().optional(),
  assigned_device_id: z.string().nullable().optional(),
  is_on_duty: z.boolean().optional()
});

export type UpdatePersonInput = z.infer<typeof updatePersonInputSchema>;

export const acknowledgeAlertInputSchema = z.object({
  id: z.number(),
  acknowledged_by: z.number()
});

export type AcknowledgeAlertInput = z.infer<typeof acknowledgeAlertInputSchema>;

export const resolveAlertInputSchema = z.object({
  id: z.number()
});

export type ResolveAlertInput = z.infer<typeof resolveAlertInputSchema>;

// Query schemas
export const getLocationHistoryInputSchema = z.object({
  person_id: z.number(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  limit: z.number().positive().optional()
});

export type GetLocationHistoryInput = z.infer<typeof getLocationHistoryInputSchema>;

export const getHealthDataInputSchema = z.object({
  person_id: z.number(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  limit: z.number().positive().optional()
});

export type GetHealthDataInput = z.infer<typeof getHealthDataInputSchema>;

export const getAlertsInputSchema = z.object({
  person_id: z.number().optional(),
  alert_type: alertTypeSchema.optional(),
  priority: alertPrioritySchema.optional(),
  is_acknowledged: z.boolean().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  limit: z.number().positive().optional()
});

export type GetAlertsInput = z.infer<typeof getAlertsInputSchema>;

// Simulation data input schemas
export const simulateGpsDataInputSchema = z.object({
  person_id: z.number(),
  duration_minutes: z.number().positive(),
  route_id: z.number().optional(),
  deviation_probability: z.number().min(0).max(1).optional()
});

export type SimulateGpsDataInput = z.infer<typeof simulateGpsDataInputSchema>;

export const simulateHealthDataInputSchema = z.object({
  person_id: z.number(),
  duration_minutes: z.number().positive(),
  stress_scenario: z.boolean().optional()
});

export type SimulateHealthDataInput = z.infer<typeof simulateHealthDataInputSchema>;