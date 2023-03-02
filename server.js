/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Arjun Sagar Dhunna Student ID: 157099219 Date: 2023-03-01
*
*  Online (Cyclic) Link: https://dull-plum-xerus-toga.cyclic.app
*
********************************************************************************/ 
var express = require("express");
var path = require("path");
var app = express();
var blog = require(__dirname + "/blog-service.js");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() 
{
    console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(express.static('public'));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname +"/views/about.html"));
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
    
        blog.getAllPosts().then((data) =>
      {
          res.json({data});
      }).catch((err) => 
      {
          res.json({message: err});
      })
  });

  app.get("/posts/add", function(req,res){
    res.sendFile(path.join(__dirname +"/views/addPost.html"));
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