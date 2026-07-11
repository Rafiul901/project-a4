import { Router } from "express";
import authRoutes from '../modules/auth/auth.route'
import categoryRouter from '../modules/category/category.route'

const router = Router();

router.use("/auth", authRoutes);
router.use('/categories',categoryRouter)

export default router; 