import { Router } from "express";
import authRoutes from '../modules/auth/auth.route'
import categoryRouter from '../modules/category/category.route'
import propertyRouter from "../modules/property/property.route";
import rentalRouter from "../modules/rental/rental.route"
import paymentRouter from "../modules/payment/payment.route";
import reviewRouter from "../modules/review/review.route";
import adminRouter from "../modules/admin/admin.route";

const router = Router();

router.use("/auth", authRoutes);
router.use('/categories',categoryRouter)
router.use("/properties", propertyRouter);
router.use("/rentals", rentalRouter);
router.use("/payments", paymentRouter)
router.use("/reviews", reviewRouter);
router.use("/admin", adminRouter);


export default router; 