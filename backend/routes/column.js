import { Router } from "express";
import { create, findAll } from "../controller/column.js";
import { validator } from "../middleware/validate.js";
import { createColumnSchema } from "../utils/validation.js";
const router = Router();

router.route("/").get(findAll);

router.route("/").post(validator(createColumnSchema), create);

export default router;
