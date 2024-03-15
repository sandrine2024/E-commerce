import express from "express";

import {getArticles,addArticle,getArticleById,deleteArticle,updateArticle} from "../controllers/articles.controller.js";

const router = express.Router();



router.post("/add", addArticle);
router.get("/get", getArticles);
router.get("/get/:id", getArticleById);
router.delete("/delete/:id", deleteArticle);
router.put("/update/:id", updateArticle);

export default router;
