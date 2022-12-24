async function getPostsByAuthor(bdd, author) {
  const posts = bdd.posts.filter((post) => post.authorName === author);
  if (!posts) throw new Error("posts not found");
  return posts;
}

module.exports = {
  getPostsByAuthor,
};
