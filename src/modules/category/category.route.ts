import { Router } from "express";
import auth from "../../middlewares/auth";
import authorize from "../../middlewares/authorize";
import validateRequest from "../../middlewares/validateRequest";
import { createCategorySchema } from "./category.validation";
import { CategoryController } from "./category.controller";


const router =Router()

router.post('/',auth,authorize("ADMIN"),validateRequest(createCategorySchema),CategoryController.createCategory);

export default router;