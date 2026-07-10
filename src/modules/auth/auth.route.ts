import { Router } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";

const router =Router()

router.post('/register',validateRequest(registerSchema),AuthController.register);


router.post('/login',validateRequest(loginSchema),AuthController.login);

router.get(
    "/me",
    auth,
    AuthController.me
);

router.post(
    "/",
    auth,
    authorize("ADMIN"),
    CategoryController.createCategory
);

router.get(
    "/",
    CategoryController.getCategories
);


export default router;