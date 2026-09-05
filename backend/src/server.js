const app = require('./app');
const env = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const { seedDefaultTemplates } = require('./config/seedDb');

let server;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    await seedDefaultTemplates();

    // 2. Start HTTP Server
    server = app.listen(env.PORT, () => {
      console.log(`=======================================================`);
      console.log(`  AI ATS Resume Analyzer Backend Engine Running`);
      console.log(`  Environment: ${env.NODE_ENV}`);
      console.log(`  Port:        ${env.PORT}`);
      console.log(`  Client URL:  ${env.CLIENT_URL}`);
      console.log(`  Health:      http://localhost:${env.PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Fatal error during backend server startup:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await disconnectDB();
      console.log('[Server] Process exiting cleanly.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Process] Uncaught Exception:', error);
  process.exit(1);
});

startServer();
