import { Router } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";

const router =Router()

router.post('/register',validateRequest(registerSchema),AuthController.register);


router.post('/login',validateRequest(loginSchema),AuthController.login);


export default router;