var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var methodOverride = require("method-override")

// EXPRESS CONFIG

var app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


// MONGOOSE CONFIG

mongoose.connect("mongodb+srv://vuka:q1RI46jxhOX0TN9c@cluster0-y9fgk.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })

var postSchema = new mongoose.Schema({
    title: String,
    body: String,
    mood: String,
    created:  {type: Date, default: Date.now}
})

var Post = mongoose.model("Post", postSchema)

// RESTFUL ROUTES

// get all posts

app.get('/posts', function(req, res){
    
    Post.find()
      .then((posts) => {
        res.status(200).json({ posts });
      })
      .catch((err) => {
        res.status(500).json({ err });
      })
})


// get one post by id
app.get("/posts/:id", function(req, res) {
 
    const id = req.params.id;

      Post.findById(id)
      .then((posts) => {
        res.status(200).json({ posts });
      })
      .catch((err) => {
        res.status(500).json({ err });
      })
  
})

// create post
app.post("/posts", function(req, res) {
    
    var title = req.body.title;
    var body = req.body.body;
    var mood = req.body.mood;
    
  if (!title || !body || !mood) {
    res.status(500).json({ error: 'All Fields Are Required.' });
  }

  const post = new Post({
    title,
    body,
    mood
  });

  post.save()
  .then((post) => {
    res.status(201).json({ post });
  })
  .catch((err) => {
    res.status(500).json({ err });
  })

})


// update post by id
app.put("/posts/:id", function(req, res){
    
    const id = req.params.id;
    
    var post = {
        title: req.body.title,
        body:  req.body.body,
        mood: req.body.mood
    }

  Post.findByIdAndUpdate(id, post)
  .then((post) => {
    res.status(200).json({ post });
  })
  .catch((err) => {
    res.status(500).json({ err });
  })

})

// delete post by id

app.delete("/posts/:id", function(req, res) {
      
    const id = req.params.id;

  Post.findByIdAndRemove(id)
  .then((post) => {
    res.status(204).json({ post });
  })
  .catch((err) => {
    res.status(500).json({ err });
  })
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("server running")
})