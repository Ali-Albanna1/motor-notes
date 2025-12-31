// middleware/is-post-author.js
const Post = require('../models/post');

const isPostAuthor = async (req, res, next) => {
  try {
    if (!req.session?.user?._id) return res.redirect('/auth/sign-in');

    const post = await Post.findById(req.params.id);
    if (!post) return res.redirect('/posts');

    const isAuthor = post.author.equals(req.session.user._id);
    if (!isAuthor) return res.status(403).redirect(`/posts/${req.params.id}`);

    req.post = post;    
    return next();
  } catch (err) {
    console.error(err);
    return res.redirect('/posts');
  }
};

module.exports = isPostAuthor;
