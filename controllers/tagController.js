const Tag = require("../models/Tag");

async function createTag(req, res) {
  try {
    const { name } = req.body;

    const queryTag = await Tag.findOne({ where: { name } });

    if (queryTag) {
      if (!queryTag.isDeleted) {
        return res.status(400).json({ msg: "Tag is existing" });
      }

      const nowTime = Date.now();
      queryTag.isDeleted = false;
      queryTag.createdAt = nowTime;
      query.updatedAt = nowTime;

      await queryTag.save();
      return res.json(queryTag);
    }

    const newTag = await Tag.create({ name });
    res.json(newTag);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getTags(req, res) {
  try {
    const tags = await Tag.findAll({
      where: {
        isDeleted: false,
      },
      attributes: {
        exclude: ["isDeleted"],
      },
    });

    res.json(tags);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function deleteTag(req, res) {
  try {
    const { id } = req.params;
    const queryTag = await Tag.findByPk(id);
    if (!queryTag) {
      return res.status(404).json({ error: "Tag not found" });
    }
    queryTag.isDeleted = true;
    await queryTag.save();
    res.status(200).json({ msg: "ok" });
  } catch (e) {
    res.status(500).json({ error: e.msg });
  }
}

module.exports = {
  createTag,
  getTags,
  deleteTag,
};
