const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const port = 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://sid-admin:qwerty1234@cluster0.msbpa.gcp.mongodb.net/blogpost', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

const Post = mongoose.model("Post", postSchema);

// DEFAULT POSTS
const mondayBlues = new Post({
  title: "Monday is here!",
  body: "This is heartbreaking, but we all gotta face that Monday blue atleast once a week! :)"
});

const chimiChangas = new Post({
  title: "Deadpool approves this post",
  body: "Maximum effort! Minimum audience reaction! Smooth!"
});

// WEATHER RELATED VARIABLES
const unit = "metric";
const apiKey = "9e7092e0dd7af0b3b8a05e1839333fd1";
const endPoint = "https://api.openweathermap.org/data/2.5/weather";
let queryParams;
let weatherUrl;

const defaultPosts = [mondayBlues, chimiChangas];

app.get('/', (req, res) => {
  // FETCH POSTS
  Post.find({}, (err, data) => {
    if (err) {
      console.log("There was an error: ", err);
    } else {
      // INSERT ONLY IF DEFAULT POSTS EMPTY
      if (!data.length) {
        Post.insertMany(defaultPosts, err => {
          if (err) {
            console.log('There was an error: ', err);
          } else {
            console.log("Default posts successfully created!");
          }
        });
        res.redirect('/');
      } else {
        console.log("Fetched the posts successfully: ", data);
        res.render('home', { content: homeStartingContent, posts: data });
      }
    }
  });
});

// ABOUT ROUTE
app.get('/about', (req, res) => {
  res.render('about', { content: aboutContent });
});

// CONTACT ROUTE
app.get('/contact', (req, res) => {
  res.render('contact', { content: contactContent });
});

// COMPOSE ROUTE
app.get('/compose', (req, res) => {
  res.render('compose');
});

// INDIVIDUAL POST
app.get('/posts/:postId', (req, res) => {
  let requestedPost = req.params.postId;
  Post.find({ "_id": requestedPost }, (err, data) => {
    if (err) {
      console.log("There was an error: ", err);
    } else {
      if (data[0]._id == requestedPost) {
        res.render('post', { title: data[0].title, body: data[0].body });
      }
    }
  });
});

// POST ROUTE FOR POSTING THE POSTS
app.post('/compose', (req, res) => {
  const post = {
    title: req.body.messageTitle,
    body: req.body.messagePost
  }
  const newPost = new Post(post);
  newPost.save();
  res.redirect('/');
});

// DELETE ROUTE
app.post('/delete', (req, res) => {
  const postID = req.body.deletePost;
  if (postID) {
    Post.findByIdAndRemove(postID, err => {
      if (err) {
        console.log("There was an error deleting the post with id: ", postID);
      } else {
        console.log("Successfully deleted the post with id: ", postID);
        res.redirect('/');
      }
    });
  } else {
    console.log("Post failed to delete");
  }
});

// LISTEN ON PORT
app.listen(process.env.PORT || port, function () {
  console.log("Server started on port ", port);
});