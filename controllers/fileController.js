async function uploadFile(req, res) {
  const { file } = req;

  if (!file) {
    res.status(400).json({ message: "No file provided" });
  }

  res.json({ msg: "File uploaded successfully", filePath: file.path });
}

module.exports = {
  uploadFile,
};
