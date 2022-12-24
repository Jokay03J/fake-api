async function getPostBySlug(bdd, slug) {
  const postIndex = bdd.posts.findIndex((post) => post.slug === slug);
  if (postIndex === -1) {
    throw new Error("post not found");
  }

  return bdd.posts[postIndex];
}

module.exports = {
  getPostBySlug,
};
