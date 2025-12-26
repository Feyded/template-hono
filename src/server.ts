import { serve } from '@hono/node-server';
import app from './app.js';
import { envConfig } from './env.js';
import { logger } from './utils/logger.js';

const mainAppEntry = app;

serve({ fetch: mainAppEntry.fetch, port: envConfig.APP_PORT }, info => {
  logger.info('Listening on port', info.port);
});
