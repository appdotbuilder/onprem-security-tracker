import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  createPersonInputSchema,
  updatePersonInputSchema,
  createGeofenceInputSchema,
  createRouteInputSchema,
  createGpsLocationInputSchema,
  createHealthDataInputSchema,
  createAlertInputSchema,
  acknowledgeAlertInputSchema,
  resolveAlertInputSchema,
  createConsentInputSchema,
  getLocationHistoryInputSchema,
  getHealthDataInputSchema,
  getAlertsInputSchema,
  simulateGpsDataInputSchema,
  simulateHealthDataInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { createPerson } from './handlers/create_person';
import { getPeople } from './handlers/get_people';
import { updatePerson } from './handlers/update_person';
import { createGeofence } from './handlers/create_geofence';
import { getGeofences } from './handlers/get_geofences';
import { createRoute } from './handlers/create_route';
import { getRoutes } from './handlers/get_routes';
import { createGpsLocation } from './handlers/create_gps_location';
import { getLocationHistory } from './handlers/get_location_history';
import { getCurrentLocations } from './handlers/get_current_locations';
import { createHealthData } from './handlers/create_health_data';
import { getHealthData } from './handlers/get_health_data';
import { getCurrentHealthStatus } from './handlers/get_current_health_status';
import { createAlert } from './handlers/create_alert';
import { getAlerts } from './handlers/get_alerts';
import { acknowledgeAlert } from './handlers/acknowledge_alert';
import { resolveAlert } from './handlers/resolve_alert';
import { getAuditLogs } from './handlers/get_audit_logs';
import { createConsent } from './handlers/create_consent';
import { getConsents } from './handlers/get_consents';
import { syncDeviceData } from './handlers/sync_device_data';
import { getDeviceStatus } from './handlers/get_device_status';
import { simulateGpsData } from './handlers/simulate_gps_data';
import { simulateHealthData } from './handlers/simulate_health_data';
import { generateDashboardData } from './handlers/generate_dashboard_data';
import { generateReports, type GenerateReportInput } from './handlers/generate_reports';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

// Generate report input schema
const generateReportInputSchema = z.object({
  reportType: z.enum(['daily', 'weekly', 'monthly']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  personIds: z.array(z.number()).optional()
});

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User Management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .query(() => getUsers()),

  // Person Management
  createPerson: publicProcedure
    .input(createPersonInputSchema)
    .mutation(({ input }) => createPerson(input)),
  
  getPeople: publicProcedure
    .query(() => getPeople()),
  
  updatePerson: publicProcedure
    .input(updatePersonInputSchema)
    .mutation(({ input }) => updatePerson(input)),

  // Geofence Management
  createGeofence: publicProcedure
    .input(createGeofenceInputSchema)
    .mutation(({ input }) => createGeofence(input)),
  
  getGeofences: publicProcedure
    .query(() => getGeofences()),

  // Route Management
  createRoute: publicProcedure
    .input(createRouteInputSchema)
    .mutation(({ input }) => createRoute(input)),
  
  getRoutes: publicProcedure
    .query(() => getRoutes()),

  // GPS Location Tracking
  createGpsLocation: publicProcedure
    .input(createGpsLocationInputSchema)
    .mutation(({ input }) => createGpsLocation(input)),
  
  getLocationHistory: publicProcedure
    .input(getLocationHistoryInputSchema)
    .query(({ input }) => getLocationHistory(input)),
  
  getCurrentLocations: publicProcedure
    .query(() => getCurrentLocations()),

  // Health Data Monitoring
  createHealthData: publicProcedure
    .input(createHealthDataInputSchema)
    .mutation(({ input }) => createHealthData(input)),
  
  getHealthData: publicProcedure
    .input(getHealthDataInputSchema)
    .query(({ input }) => getHealthData(input)),
  
  getCurrentHealthStatus: publicProcedure
    .query(() => getCurrentHealthStatus()),

  // Alert Management
  createAlert: publicProcedure
    .input(createAlertInputSchema)
    .mutation(({ input }) => createAlert(input)),
  
  getAlerts: publicProcedure
    .input(getAlertsInputSchema)
    .query(({ input }) => getAlerts(input)),
  
  acknowledgeAlert: publicProcedure
    .input(acknowledgeAlertInputSchema)
    .mutation(({ input }) => acknowledgeAlert(input)),
  
  resolveAlert: publicProcedure
    .input(resolveAlertInputSchema)
    .mutation(({ input }) => resolveAlert(input)),

  // Audit and Compliance
  getAuditLogs: publicProcedure
    .query(() => getAuditLogs()),

  // Consent Management (GDPR)
  createConsent: publicProcedure
    .input(createConsentInputSchema)
    .mutation(({ input }) => createConsent(input)),
  
  getConsents: publicProcedure
    .query(() => getConsents()),

  // Device Synchronization
  syncDeviceData: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(({ input }) => syncDeviceData(input.deviceId)),
  
  getDeviceStatus: publicProcedure
    .query(() => getDeviceStatus()),

  // Data Simulation for Demo
  simulateGpsData: publicProcedure
    .input(simulateGpsDataInputSchema)
    .mutation(({ input }) => simulateGpsData(input)),
  
  simulateHealthData: publicProcedure
    .input(simulateHealthDataInputSchema)
    .mutation(({ input }) => simulateHealthData(input)),

  // Dashboard and Reporting
  getDashboardData: publicProcedure
    .query(() => generateDashboardData()),
  
  generateReports: publicProcedure
    .input(generateReportInputSchema)
    .mutation(({ input }) => generateReports(input as GenerateReportInput)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      // Enable CORS for cross-origin requests
      cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true
      })(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`🚀 TRPC MVP Tracking System server listening at port: ${port}`);
  console.log(`📍 GPS Tracking API ready`);
  console.log(`💓 Health Monitoring API ready`);
  console.log(`🚨 Alert Engine API ready`);
  console.log(`🔒 GDPR Compliance API ready`);
  console.log(`📊 Dashboard API ready`);
}

start();