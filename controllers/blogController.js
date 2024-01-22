const Blog = require('../models/Blog');
const Tag = require('../models/Tag');
const User = require('../models/User');

async function createBlog(req, res) {
  try {
    const { title, content, coverImage, tags } = req.body;

    const existTags = await Tag.findAll({ where: { name: tags } });

    console.log('existTags ===', existTags);

    if (existTags.length === 0) {
      return res.status(400).json({ msg: '标签不存在' });
    }

    const newBlog = await Blog.create({
      title,
      content,
      coverImage,
      isDeleted: false,
    });

    await newBlog.setTags(existTags);

    res.json(newBlog);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getBlogList(req, res) {
  try {
    const { page, pageSize } = req.query;

    const _page = Number(page);
    const _pageSize = Number(pageSize);

    const blogList = await Blog.findAndCountAll({
      offset: (_page - 1) * _pageSize,
      limit: _pageSize,
      where: {
        isDeleted: false,
      },
      // 用途是 ???
      distinct: true,
      attributes: {
        exclude: ["isDeleted"],
      },
      // 取关联表的属性 ??
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: {
            exclude: ["isDeleted", "createdAt", "updatedAt"],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: "user",
          attributes: ["nickname", "id"],
        },
      ],
    });

    res.json(blogList);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getBlogById(req, res) {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({
      where: {
        id,
        isDeleted: false,
      },
      attributes: {
        exclude: ["isDeleted"],
      },
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: {
            exclude: ["isDeleted", "createdAt", "updatedAt"],
          },
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: "user",
          attributes: ["nickname", "id"],
        },
      ]
    });

    if (!blog) {
      return res.status(404).json({ msg: 'No Find' });
    }

    res.json(blog);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
}

async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const { title, content, coverImage, tags } = req.body;

    const blog = await Blog.findByPK(id);

    if (!blog) {
      return res.status(404).json({ error: 'Not Found Blog' });
    }

    blog.title = title;
    blog.content = content;
    blog.coverImage = coverImage;
    blog.updateAt = Date.now();

    await blog.save();

    const existingTags = await Tag.findAll({
      where: {
        name: tags,
      },
    });

    if (existingTags.length === 0) {
      return res.status(404).json({ error: 'Not Found Tag' });
    }

    await blog.setTags(existingTags);

    return res.json(blog);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function queryByTag(req, res) {
  try {
    const { id } = req.params;

    const result = await Tag.findAll({
      where: {
        id
      },
      attributes: {
        exclude: [isDeleted, updateAt, createAt],
      },
      include: {
        model: Blog,
        as: 'blogs',
        where: {
          isDeleted: false,
        },
        attributes: {
          exclude: ['isDeleted'],
        },
        throug: {
          attributes: [],
        },
      },
    });

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function deleteBlog(req, res) {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json('Not Found Blog');
    }

    blog.isDeleted = true;

    await blog.save();

    res.json({ msg: 'OK' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  createBlog,
  getBlogList,
  getBlogById,
  updateBlog,
  queryByTag,
  deleteBlog,
}
