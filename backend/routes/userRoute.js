import express from "express";
import {createUser, getallusers, deleteUser, uploadProfileImage, updateUser} from '../controllers/userController.js';
import roleBasedAuth from "../middleware/rolebasedAuth.js";
import auth from "../middleware/auth.js";
import { ROLE_ADMIN } from "../constants/roles.js";


const router = express.Router();

router.post("/create", auth, roleBasedAuth(ROLE_ADMIN),  createUser);
router.delete("/delete/:id", auth, roleBasedAuth(ROLE_ADMIN),  deleteUser);
router.get("/getall", auth, roleBasedAuth(ROLE_ADMIN),  getallusers);
router.put("/update", auth,   updateUser);

router.put("profile/upload", auth, uploadProfileImage );
export default router;