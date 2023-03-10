/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Arjun Sagar Dhunna Student ID: 157099219 Date: 2023-03-10
*
*  Online (Cyclic) Link: https://dull-plum-xerus-toga.cyclic.app
*
********************************************************************************/ 
var express = require("express");
var path = require("path");
var app = express();
var blog = require(__dirname + "/blog-service.js");
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer();// no { storage: storage } since we are not using disk storage
const exphbs = require('express-handlebars');
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() 
{
    console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(express.static('public'));

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
        
    }
}));

app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});


app.get("/", function(req,res){
    res.redirect('/about');
  });

app.get("/about", function(req,res){
    res.render('about');
  });

app.get("/blog", (req, res)=>
  {
      blog.getPublishedPosts().then((data) =>
      {
          res.json({data});
      }).catch((err)=>
      {
          res.json({message: err});
      })
  });

app.get("/posts", (req, res)=>
  {
    if(req.query.minDate) {
        blog.getPostsByMinDate(req.query.minDate).then((data) => 
        {
            res.json({data});
        })
        .catch((err) => 
        {
            res.json({message: err});
        })
    }

    else if(req.query.category) {
        blog.getPostsByCategory(req.query.category).then((data) => 
        {
            res.json({data});
        })
        .catch((err) => 
        {   
            res.json({message: err});
        })
    }

else {
    blog.getAllPosts().then((data) =>
  {
      res.json({data});
  }).catch((err) => 
  {
      res.json({message: err});
  })
}
  });

  app.get("/post/:value", (req, res) => 
  {
    blog.getPostById(req.params.value).then((data) => 
    {
        res.json({data});
    })
    .catch((err) => 
    {
        res.json({message: err});
    })
  });

  cloudinary.config({
    cloud_name: 'dg87xtoi5',
    api_key: '464978948788995',
    api_secret: 'HHzDJaJZlzchX7DIbfk13Khnn2g',
    secure: true
});


  app.get("/posts/add", function(req,res){
    res.render('addPost');
  });

  app.get("/categories", (req, res)=>
  {
      blog.getCategories().then((data)=>
      {
          res.json({data});
      }).catch((err) => 
      {
          res.json({message: err});
      })
  });

  app.post("/posts/add", upload.single("featureImage"), (req, res) => 
  {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
        let addBlog = {};

            addBlog.body = req.body.body;
            addBlog.title = req.body.title;
            addBlog.postDate = Date.now();
            addBlog.category = req.body.category;
            addBlog.featureImage = req.body.featureImage;
            addBlog.published = req.body.published;

            blog.addPost(addBlog);
            res.redirect('/posts'); 
    });
    
  });
  
  app.use((req, res)=>
{
    res.status(404).end('404 Page Not Found');
});

//app.listen(HTTP_PORT, onHttpStart());

blog.initialize().then(() => 
{
 app.listen(HTTP_PORT, onHttpStart());
}).catch (() => 
{
    console.log('Promise is not Resolved');
});