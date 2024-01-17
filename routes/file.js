const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const uplodaMiddleware = require('../middleware/fileMiddleware').default

// 目前只有一个上传文件接口
router.post("/file", uplodaMiddleware, fileController.uploadFile);

module.exports = router;
