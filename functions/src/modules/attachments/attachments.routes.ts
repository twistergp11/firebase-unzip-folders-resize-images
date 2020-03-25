
import * as express from 'express';
import { uploadImage } from './attachments.service'

const router = express.Router();


router.post('/file', uploadImage)


export default router;
