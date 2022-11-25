const express = require("express");
const app = express();
const https = require("https");
var XMLHttpRequest = require('xhr2');
const ejs = require("ejs");
const bodyParser=require("body-parser");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
      res.sendFile(__dirname+"/index.html");
})
var message="";
app.get("/trending",function(req,res){
  const trending_url="https://api.giphy.com/v1/gifs/trending?api_key=AemlFdVuUGzr3PU3apdUaML3vAwYrAie&limit=25&rating=g";
  var GiphyAJAXCall = new XMLHttpRequest();
  GiphyAJAXCall.open("GET", trending_url);
  GiphyAJAXCall.send();
  GiphyAJAXCall.addEventListener("load", function (data) {
  var actualData = data.target.response;
  actualData = JSON.parse(actualData);
  var image = actualData.data;
  var message="Showing trending gifs";
    res.render("post",{message:message,image:image});
})
})
app.get("*",function(req,res){
  res.render("error");
})
app.post("/",function(req,res){
        const query=req.body.cityName;
      if(query=="")
      {
        res.render("error");
      }
      else{
        const url = "https://api.giphy.com/v1/gifs/search?api_key=AemlFdVuUGzr3PU3apdUaML3vAwYrAie&q="+query+"&limit=25&offset=0&rating=g&lang=en";
        https.get(url,function(response){
        if(response.statusCode!=200)
        {
          res.render("error");
        }
        else
        {
          var GiphyAJAXCall = new XMLHttpRequest();
          GiphyAJAXCall.open("GET", url);
          GiphyAJAXCall.send();
          GiphyAJAXCall.addEventListener("load", function (data) {
          var actualData = data.target.response;
          actualData = JSON.parse(actualData);
          // drill down to the data array
          var image = actualData.data;
          message="Showing gifs for "+query;
            res.render("post",{message:message,image:image});
  });
}
})
}
})
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000. ");
})
