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



module.exports = router;