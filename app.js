const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema = {
    title:String,
    content:String
}

const Article = mongoose.model("Article",articleSchema);



app.route("/")
.get(function(req,res){
    res.render("index");
});



app.route("/articles")
.get(function(req,res){
    Article.find({},function(err,foundArticles){
        if(err) res.send(err);
        else res.send(foundArticles);
        
    });
})
.post(function(req,res){
    title=req.body.title;
    content=req.body.content;
    
    const article = new Article({
    title:title,
    content:content
    });
    
    article.save(function(err){
        if(err) res.send(err);
        else res.send("Success");
    });
    })
    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(err) res.send(err)
            else res.send("Deleted all articles");
        });
    });




app.route("/articles/:article")
.get(function(req,res){
    Article.findOne({title:req.params.article},function(err,foundArticle){
        if(err) res.send(err)
        else{
            if(foundArticle) res.send(foundArticle);
            else res.send("No article found");
        }
    });
})
.put(function(req,res){
Article.update({title:req.params.article},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
        if(err) res.send(err)
        else res.send("Successfully updated article");
    });
})
.patch(function(req,res){
Article.update({title:req.params.article},
    {$set:req.body},
    function(err){
        if(err) res.send(err);
        else res.send("Successfully updated article");
    });
})
.delete(function(req,res){
Article.deleteOne({title:req.params.article},
    function(err){
        if(err) res.send(err);
        else res.send("Deleted article "+req.params.article+" Successfully");
    });
});





app.listen(3000,function(){
console.log("Server running on port 3000");
});