const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({

    author: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    text: {

    type : String,
    required: true,

    }, 

},
{
      timestamps: true,
    },

)


// post Schema 
const postSchema = mongoose.Schema({

title : {
   type: String,
   required:true,   
},
content: {
    type: String,
    required:true, 
},

author : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
},

model : {
    type: String,
    required:true, 
},

brand : {
    type: String,
    required:true, 
},

year :{
    type: Number,
    required:true, 
},

comments:[commentSchema],

},

 {
      timestamps: true,
    },

);


// then we register the model with mongoose
const Post = mongoose.model('Post', postSchema);

// export the model
module.exports = Post;