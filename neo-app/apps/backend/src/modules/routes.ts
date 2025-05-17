import express from 'express';
import assignmentRoutes from './assignment/assignmentRoutes';

const router = express.Router();

router.use('/assignments', assignmentRoutes);

export default router;