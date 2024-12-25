import express from 'express';
import assessmentRouter from './assessment/assessmentRoutes';

const router = express.Router();

router.use('/assessments', assessmentRouter);

export default router;