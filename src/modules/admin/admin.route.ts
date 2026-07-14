import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import { AdminController } from "./admin.controller";


const router = Router();


router.use(auth, authorize("ADMIN"));


router.get("/users", AdminController.getAllUsers);


router.get("/users/:id", AdminController.getUserById);

router.patch("/users/:id", AdminController.updateUser);

router.delete("/users/:id", AdminController.deleteUser);


router.get("/dashboard", AdminController.getDashboardStats);


router.get("/properties", AdminController.getAllProperties);


router.get("/rentals", AdminController.getAllRentals);


router.get("/payments", AdminController.getAllPayments);

export default router;