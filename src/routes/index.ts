import { Router } from "express";
import authRoutes from '../modules/auth/auth.route'
import categoryRouter from '../modules/category/category.route'
import propertyRouter from "../modules/property/property.route";
import rentalRouter from "../modules/rental/rental.route"
const router = Router();

router.use("/auth", authRoutes);
router.use('/categories',categoryRouter)
router.use("/properties", propertyRouter);
router.use("/rentals", rentalRouter);
export default router; 