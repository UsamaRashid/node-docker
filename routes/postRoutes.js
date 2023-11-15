const express = require("express");
const protect = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

const router = express.Router();

router.get("/", protect, postController.getAllPosts);
router.post("/", protect, postController.createPost);

router.get("/:id", protect, postController.getOnePost);
router.patch("/:id", protect, postController.updatePost);
router.delete("/:id", protect, postController.deletePost);

module.exports = router;
