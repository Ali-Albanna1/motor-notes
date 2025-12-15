const express = require('express');

const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');



//read
router.get('/', async (req,res) => {

    try{
         
        const posts = await Post.find({}).populate('author')

        console.log(posts)

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
        const post = await Post.findById(req.params.id).populate('author')

        res.render('posts/show.ejs', {post})
    }

    catch(err){
        console.error(err);
        res.redirect('/');
    }
});

// Edit/ Update

router.get('/:id/edit', async (req,res)=>{

    try{

        const post = await Post.findById(req.params.id)

        res.render('posts/edit.ejs',{post})
    }

    catch(err){
       
        console.error(err)
    }

})

router.put('/:id', async (req,res)=>{

    try{
        
        const post = await Post.findById(req.params.id)

        isAuthor = post.author.equals(req.session.user._id)

        if(isAuthor){
                
            await post.updateOne(req.body)

            res.redirect(`/posts/${req.params.id}`)

        }

        else{

              res.redirect(`/posts/${req.params.id}`)


        }

    }

    catch(err){
         res.redirect('')
         console.error(err)
    }

})


//Delete

router.delete('/:id', async (req,res) =>{


    try{
        
        const post = await Post.findById(req.params.id)
        
        isAuthor = post.author.equals(req.session.user._id)

        if(isAuthor){

             await post.deleteOne(req.body)

             res.redirect('/posts')
        }
        else{
               
            throw new Error(`permission denied to ${req.session.user.username}`)

        }

    }

     catch(err){
         res.redirect('')
         console.error(err)
    }

})


module.exports = router;