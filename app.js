const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const tagRoutes = require("./routes/tags");
const fileRoutes = require("./routes/file");
const sequelize = require("./config/database");
const authMiddleware = require('./middleware/authMiddleware')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/tempFiles", express.static(path.join(__dirname, "tempFiles")));

app.use("/auth", authRoutes);

app.use(authMiddleware);
app.use("/blog", blogRoutes);
app.use("/tags", tagRoutes);
app.use("/upload", fileRoutes);

sequelize
  .sync()
  .then(() => console.log("DataBase synced"))
  .catch(err => {
    console.error('Error syncing', error);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
