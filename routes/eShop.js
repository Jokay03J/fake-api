const { Router } = require("express");
const { v4 } = require("uuid");
const bdd = require("../db/shopItems.json");
const { Savebdd } = require("../utils/saveBdd");
const router = Router();

/**
 * @description get all items
 * @default limit 30
 * @default page 1
 */
router.get("/all", (req, res) => {
  let { limit, page } = req.query;
  if (limit && page) {
    limit = limit ? parseInt(limit, 10) : 30;
    page = page ? parseInt(page, 10) : 1;
    const min = (page - 1) * limit;
    const items = bdd.items.slice(min, min + limit);

    res.json({ items, limit: limit ? limit : 30, page: page ? page : 1 });
  } else {
    res.json({ items: bdd.items });
  }
});

/**
 * @description buy a item
 * @requires id
 */
router.post("/buy", (req, res) => {
  const { id, amount } = req.query;
  if (!id || !amount) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  const itemIndex = bdd.items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send({ error: true, message: "item not found" });
  }

  const amountParsed = parseInt(amount);

  if (isNaN(amountParsed)) {
    return res
      .status(400)
      .send({ error: true, message: "amount is not a number" });
  }

  if (bdd.items[itemIndex].amount - amountParsed < 0) {
    return res
      .status(409)
      .send({ error: true, message: "this item can't be buy" });
  }

  bdd.items[itemIndex].amount -= amountParsed;
  Savebdd(bdd, "shopItems");
  return res.send(bdd.items[itemIndex]);
});

/**
 * @description sell a item
 * @requires id
 */
router.post("/sell", (req, res) => {
  const { id, amount } = req.query;
  if (!id || !amount) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  const itemIndex = bdd.items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send({ error: true, message: "item not found" });
  }

  const amountParsed = parseInt(amount);

  if (isNaN(amountParsed)) {
    return res
      .status(400)
      .send({ error: true, message: "amount is not a number" });
  }

  const item = bdd.items[itemIndex];
  item.amount += amountParsed;
  Savebdd(bdd, "shopItems");
  return res.status(200).send(bdd.items[itemIndex]);
});

/**
 * @description remove item by id
 * @requires id
 */
router.delete("/delete", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  const itemIndex = bdd.items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send({ error: true, message: "item not found" });
  }

  bdd.items = bdd.items.filter((item) => item.id !== id);
  Savebdd(bdd, "shopItems");
  return res.status(204).send();
});

/**
 * @description create item
 * @requires name
 * @optional amount
 */
router.post("/create", (req, res) => {
  const { name, amount } = req.body;
  if (!name) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }
  if (typeof amount !== "number") {
    return res
      .status(400)
      .send({ error: true, message: "amount is not a number" });
  }
  const id = v4();
  bdd.items.unshift({ name, amount: amount ? amount : 0, id });
  Savebdd(bdd, "shopItems");
  return res.status(201).send({ name, amount: amount ? amount : 0, id });
});

/**
 * @description update item
 * @requires id
 * @requires name or amount
 */
router.put("/put", (req, res) => {
  const { id } = req.query;
  const { name, amount } = req.body;
  if (!id || (!name && !amount)) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  const itemIndex = bdd.items.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).send({ error: true, message: "item not found" });
  }
  if (typeof amount !== "number") {
    return res
      .status(400)
      .send({ error: true, message: "amount is not a number" });
  }

  bdd.items[itemIndex] = {
    ...bdd.items[itemIndex],
    name: name ? name : bdd.items[itemIndex].name,
    amount: amount ? amount : bdd.items[itemIndex].amount,
  };
  Savebdd(bdd, "shopItems");
  return res.status(200).send(bdd.items[itemIndex]);
});

module.exports = {
  eShopRouter: router,
};
