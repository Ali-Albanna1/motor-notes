const express = require('express');

const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

//middleware
const isPostAuthor = require('../middleware/is-post-author')




//read
router.get('/', async (req,res) => {

    try{
         
        const posts = await Post.find({}).populate('author')

        
        res.render('posts/index.ejs', {posts})

    }

    catch(err){
        console.error(err)
    }
}) 


//create 
router.get('/new', async(req,res)=>{

    try{
        
        res.render('posts/new.ejs')
    }
     catch(err){
        console.error(err)
    }
})

router.post('/', async (req,res) =>{
    try{
     
        req.body.author = req.session.user._id

        await Post.create(req.body)

        res.redirect('/posts')

    }
     catch(err){
        res.redirect('/posts/new')
        console.error(err)
    }
})

//show
router.get('/:id', async (req,res) => {

    try{

        const post = await Post.findById(req.params.id).populate('comments.author').populate('author')

        res.render('posts/show.ejs', {post})
    }

    catch(err){
        console.error(err);
        res.redirect('/');
    }
});

// Edit/ Update
 
router.get('/:id/edit', isPostAuthor, async (req,res)=>{

    try{
       
       res.render('posts/edit.ejs', { post: req.post });

    }

    catch(err){
       
        console.error(err)
    }

})

router.put('/:id', isPostAuthor, async (req,res)=>{

    try{
    
           await req.post.updateOne(req.body);

    return res.redirect(`/posts/${req.params.id}`);

    }

    catch(err){
         res.redirect(`/posts/${req.params.id}`)
         console.error(err)
    }

})

//comments add

router.post('/:id/comments', async (req,res)=>{

     try{ 
        
    const post = await Post.findById(req.params.id)


    post.comments.push({

        text: req.body.comment,
        author: req.session.user._id,

    })

    await post.save()
    
    res.redirect(`/posts/${req.params.id}`)
     
    
}

catch(err){

    console.error(err)

        res.redirect(`/posts/${req.params.id}`)

}
   
})

//Delete

router.delete('/:id',isPostAuthor, async (req,res) =>{


    try{
        
       
    

             await req.post.deleteOne()

             res.redirect('/posts')
        
       
    }

     catch(err){
    
      console.error(err);
  return res.redirect(`/posts/${req.params.id}`);

    }

})

// comment delete
router.delete('/:postId/comments/:commentId', async (req,res) => {


    try{
         const post = await Post.findById(req.params.postId)

    const comment = post.comments.id(req.params.commentId)
    
    if (!comment) { return res.redirect(`/posts/${req.params.postId}`) }

    
    const isCommentAuthor = comment.author.equals(req.session.user._id)

    const isPostAutor = post.author.equals(req.session.user._id)

   if (isCommentAuthor||isPostAutor){
    
    comment.deleteOne()

    await post.save()
    }
   

   else{
    
    throw new Error(`permission denied`)
    
    
    
   }
   
   res.redirect(`/posts/${req.params.postId}`)

}  catch(err){

    console.error(err) 
    
    res.redirect(`/posts/${req.params.postId}`)
    }


});



module.exports = router;