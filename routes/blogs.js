const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// 创建博客
router.post('/create', blogController.createBlog);

// 查询博客列表
router.get('/query', blogController.getBlogList);

// 根据 id查询博客详情
router.get('/query/:id', blogController.getBlogById);

// 根据 id修改博客
router.patch('/update/:id', blogController.updateBlog);

// 根据 id删除博客
router.delete('/delete/:id', blogController.deleteBlog);

module.exports = router;
