const fs = require('fs');  
var posts = [];
var categories = [];

exports.initialize = () =>{
    return new Promise ((resolve, reject) =>{
        fs.readFile('./data/posts.json', (err,data)=> {
            if (err) {
                reject ('unable to read file');
            }
            else {
                posts = JSON.parse(data);
            }
        });
        fs.readFile('./data/categories.json', (err,data) =>{
            if (err) {
                reject ('unable to read file');
            }
            else {
                categories = JSON.parse(data);
            }
        })       
        resolve();
    })
};

exports.getAllPosts= function() {
    return new Promise((resolve, reject) => {
        if (posts.length != 0) 
        {
            resolve(posts);
            
        } else 
        {
            reject("No results returned");
        }
    })
};

exports.addPost= function(postData) {
    return new Promise((resolve, reject) => {
        postData.published == undefined ? postData.published = false : postData.published = true;
        postData.id = posts.lenght + 1;
        if (posts.length != 0) 
        {
            posts.push(postData);
            resolve(postData);
        } else 
        {
            reject("No results returned");
        }
    })
};

exports.getCategories = function() {
    return new Promise ((resolve,reject) => {
        if (categories.length != 0) 
        {
            resolve(categories);
        }
        else 
        {
            reject('no result found');
            
        }
    })
};

exports.getPublishedPosts = function() {
    return new Promise ((resolve, reject) => {
        var publish = posts.filter(post => post.published == true);
        if (publish.length != 0) 
        {
            resolve(publish);
            
        }
        else
        {
            reject('no result found');
        }
        
    })
};