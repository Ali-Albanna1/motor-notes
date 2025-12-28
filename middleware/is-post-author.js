const Post = require('../models/post');

const isPostAuthor = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.redirect('/posts');
    }

    const isAuthor = post.author.equals(req.session.user._id);

    if (!isAuthor) {
      return res.status(403).redirect(`/posts/${req.params.id}`);
    }

    
    req.post = post;

    next();
  } catch (err) {
    console.error(err);
    res.redirect('/posts');
  }
};

module.exports = isPostAuthor;
