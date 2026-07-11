import { Router } from "express";
import authRoutes from '../modules/auth/auth.route'
import categoryRouter from '../modules/category/category.route'
import propertyRouter from "../modules/property/property.route";
const router = Router();

router.use("/auth", authRoutes);
router.use('/categories',categoryRouter)
router.use("/properties", propertyRouter);
export default router; 