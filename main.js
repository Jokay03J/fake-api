const express = require("express");
const cors = require("cors");
require("dotenv").config(".env");
const { postsRouter } = require("./routes/posts");
const { todoListRouter } = require("./routes/todoList");
const { eShopRouter } = require("./routes/eShop");
const app = express();
const PORT = process.env.PORT || 3000;

// middlewars
app.use(cors({ origin: "*" }));
app.use(express.json());

// routes
app.use("/api/posts", postsRouter);
app.use("/api/todos", todoListRouter);
app.use("/api/shop", eShopRouter);

app.listen(PORT, () => {
  console.log(`serveur ouvert sur le port ${PORT}`);
});
