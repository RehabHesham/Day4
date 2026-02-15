import { Router } from "express";
import { login, register } from "../controllers/accountController.js";
import { registerValiator, loginValidator } from "../middlewares/validator.js";
import validationHandler from "../middlewares/validationHandler.js";

const router = Router();

router.post("/register", registerValiator, validationHandler, register);
router.post("/login", loginValidator, validationHandler, login);

export default router;
