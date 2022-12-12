// const { Router } = require('express')
const express = require('express') //express framework
var path = require('path');
// const http = require('http')
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT
const app = express()
var Handlebars = require("hbs");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//read routes modules
var routes = require('./routes/index');
const { response } = require('express');

//Handlebars partials rendering
Handlebars.registerPartials(__dirname+"/views/partials");

//Method logging middleware
function methodLogger(request, response, next){
  console.log("METHOD LOGGER");
  console.log("================================");
  console.log("METHOD: " + request.method);
  console.log("URL:" + request.url);
  next(); //call next middleware registered
}


//Middleware
app.use(routes.initDB);
app.use(routes.authenticate); //authenticate user
app.use(express.static(__dirname + '/public')) //static server
app.use(methodLogger);
app.use(express.json());
app.use(express.urlencoded());

//Routes
app.get(['/index.html', '/'], routes.index);
app.get("/books", routes.books)
app.get("/order", routes.order)
app.get('/getBook', routes.getBook)
app.post('/sendOrder', routes.sendOrder)



//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log("http://localhost:3000/")
    
  }
})
