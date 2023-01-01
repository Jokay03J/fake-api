const { Router } = require("express");
const router = Router();
const bdd = require("../db/todos.json");
const { Savebdd } = require("../utils/saveBdd");

/**
 * @description get all todos(by limit and pages)
 * @default limit 30
 * @default page 1
 */
router.get("/all", (req, res) => {
  let { limit, page } = req.query;
  if (limit && page) {
    limit = limit ? parseInt(limit, 10) : 30;
    page = page ? parseInt(page, 10) : 1;
    const min = (page - 1) * limit;
    const todos = bdd.todos.slice(min, min + limit);

    res.json({ todos, limit: limit ? limit : 30, page: page ? page : 1 });
  } else {
    res.json({ todos: bdd.todos });
  }
});

/**
 * @description get todo by id
 * @requires id
 */
router.get("/get", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  const todoIndex = bdd.todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).send({ error: true, message: "todo not found" });
  }

  res.status(200).send(bdd.todos[todoIndex]);
});

/**
 * @description create todo
 * @requires name
 */
router.post("/create", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  if (bdd.todos.find((todo) => todo.name === name)) {
    return res.status(409).send({ error: true, message: "todo already exist" });
  }

  const { v4 } = require("uuid");
  const id = v4();
  bdd.todos.unshift({ name, completed: false, id });
  Savebdd(bdd, "todos");
  res.status(201).send({ name, completed: false, id });
});

/**
 * @description delete todo by id
 * @requires id
 */
router.delete("/delete", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  bdd.todos = bdd.todos.filter((todo) => todo.id !== id);
  Savebdd(bdd, "todos");
  res.status(204).send();
});

/**
 * @description update todo by id
 * @requires id
 * @type {string}
 * @requires completed
 * @type {boolean}
 */
router.put("/put", (req, res) => {
  const { id } = req.query;
  const { completed } = req.body;

  if (!id || typeof completed !== "boolean") {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  const todoIndex = bdd.todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).send({ error: true, message: "todo not found" });
  }

  bdd.todos[todoIndex] = {
    ...bdd.todos[todoIndex],
    completed,
  };
  Savebdd(bdd, "todos");
  res.status(200).send(bdd.todos[todoIndex]);
});

module.exports = {
  todoListRouter: router,
};
