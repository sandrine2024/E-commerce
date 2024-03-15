import express from "express";

import {sign,signup,getUsers,getUserById,deleteUser, updateUser,} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/sign", sign);
router.get("/get", getUsers);
router.get("/get/:id", getUserById);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUser);

export default router;
