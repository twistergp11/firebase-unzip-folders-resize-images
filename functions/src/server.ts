import * as express from 'express';
import * as cors from 'cors';

import attachmentsRoutes from './modules/attachments/attachments.routes';

const app = express();

const whitelist = [
  'http://localhost:3000/',
  // any other url you own
  
 
];

const corsOptions = {
  origin: function(origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(
        new Error(
          `Not allowed by CORS : origin=>${origin}`,
        ),
      );
    }
  },
};

app
  .use(cors(corsOptions))
  .use('/', attachmentsRoutes)
  .use('*', (_, res) =>
    res.status(404).json({
      success: false,
      message: 'endpoint not found',
    }),
  );

export default app;
