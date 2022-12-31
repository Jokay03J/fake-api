const { Router } = require("express");
const { Savebdd } = require("../utils/saveBdd");
const route = Router();
const bdd = require("../db/posts.json");
const { getPostBySlug } = require("../utils/getPostBySlug");
const { getPostsByAuthor } = require("../utils/getPostsByAuthor");

/**
 * @description get all posts(with limit and page)
 * @default limit 30
 * @default page 1
 * @returns posts
 */
route.get("/all", (req, res) => {
  let { limit, page } = req.query;
  limit = limit ? parseInt(limit, 10) : 30;
  page = page ? parseInt(page, 10) : 1;
  const min = (page - 1) * limit;
  const posts = bdd.posts.slice(min, min + limit);

  res.json({ posts, limit: limit ? limit : 30, page: page ? page : 1 });
});

/**
 * @description get post by slug or author
 * @default by slug
 * @returns posts or post
 */
route.get("/get", (req, res) => {
  const { query, by } = req.query;
  if (!query) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  switch (by) {
    case "slug":
      getPostBySlug(bdd, query)
        .then((post) => res.json(post))
        .catch((err) =>
          res.status(404).send({ error: true, message: err.message })
        );
      break;

    case "author":
      getPostsByAuthor(bdd, query)
        .then((posts) => {
          res.send({ posts, length: posts.length });
        })
        .catch((err) => {
          res.status(404).send({ error: true, message: err.message });
        });
      break;

    default:
      getPostBySlug(bdd, query)
        .then((post) => res.json(post))
        .catch((err) =>
          res.status(404).send({ error: true, message: err.message })
        );
      break;
  }
});

/**
 * @description create new post
 * @returns status 204
 * @requires title
 * @requires content
 * @requires image
 * @requires authorName
 */
route.post("/create", (req, res) => {
  const { title, content, image, authorName } = req.body;
  if (!title || !content || !image || !authorName) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  const slug = title.replaceAll(/[&\/\\#,+()$~%.'":*?<>{} ]/g, "-");
  if (bdd.posts.find((post) => post.slug === slug)) {
    return res.status(409).send({ error: true, message: "post already exist" });
  }

  bdd.posts.unshift({ title, content, image, authorName, slug });
  Savebdd(bdd, "posts");
  res.status(201).send({ title, content, image, authorName });
});

route.delete("/delete", (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).send({ error: true, message: "request malformed" });
  }

  const isFound = bdd.posts.find((post) => post.slug === query);
  if (!isFound) {
    return res.status(404).send({ error: true, message: "post not found" });
  }

  bdd.posts = bdd.posts.filter((post) => post.slug !== query);
  Savebdd(bdd, "posts");
  res.status(204).send();
});

/**
 * @description modify post by slug
 * @requires title or content or image
 */
route.put("/put", (req, res) => {
  const { title, content, image } = req.body;
  const { query } = req.query;
  if (!title && !content && !image) {
    return res.status(304).send();
  }
  const postIndex = bdd.posts.findIndex((post) => post.slug === query);
  if (postIndex === -1) {
    return res.status(404).send({ error: true, message: "post not found" });
  }

  bdd.posts[postIndex] = {
    ...bdd.posts[postIndex],
    title: title ? title : bdd.posts[postIndex].title,
    content: content ? content : bdd.posts[postIndex].content,
    image: image ? image : bdd.posts[postIndex].image,
  };
  Savebdd(bdd, "posts");
  res.json(bdd.posts[postIndex]);
});

module.exports = {
  postsRoute: route,
};
