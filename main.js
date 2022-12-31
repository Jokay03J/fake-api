const express = require("express");
const cors = require("cors");
require("dotenv").config(".env");
const { postsRoute } = require("./routes/posts");
const { todoListRoutes } = require("./routes/todoList");
const app = express();
const PORT = process.env.PORT || 3000;

// middlewars
app.use(cors({ origin: "*" }));
app.use(express.json());

// routes
app.use("/api/posts", postsRoute);
app.use("/api/todos", todoListRoutes);

app.listen(PORT, () => {
  console.log(`serveur ouvert sur le port ${PORT}`);
});
