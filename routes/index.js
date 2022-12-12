
// // const { Http2ServerRequest } = require('http2');
// var url = require('url');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/Project.db');
const http = require('http');
var Handlebars = require("hbs");
const { response } = require('express');
const { resourceLimits } = require('worker_threads');
const { Database } = require('sqlite3');


db.serialize(function(){
	  
      var sqlString = "CREATE TABLE IF NOT EXISTS Users (Email TEXT PRIMARY KEY, Username TEXT NOT NULL, Password TEXT NOT NULL, BI TEXT NOT NULL, SI TEXT NOT NULL, Role TEXT NOT NULL, Expend REAL NOT NULL)";
      db.run(sqlString);
	  sqlString = "CREATE TABLE IF NOT EXISTS Publishers (Email TEXT PRIMARY KEY, Name TEXT NOT NULL, Phone TEXT NOT NULL, BI TEXT NOT NULL, Address TEXT NOT NULL)";
      db.run(sqlString);
	  sqlString = "CREATE TABLE IF NOT EXISTS Books (ISBN INTEGER PRIMARY KEY, Title TEXT NOT NULL, Author TEXT NOT NULL, Genre TEXT NOT NULL, Price REAL NOT NULL, NumPages INTEGER NOT NULL, Quantity INT NOT NULL, QT INT NOT NULL, SalesPercent REAL NOT NULL, TP REAL NOT NULL, Publisher TEXT NOT NULL, FOREIGN KEY(Publisher) REFERENCES Publisher(Email))";
      db.run(sqlString);
	  sqlString = "CREATE TABLE IF NOT EXISTS Orders (OrderNum INTEGER PRIMARY KEY, BI TEXT NOT NULL, SI TEXT NOT NULL,  TPrice REAL NOT NULL, User_Email TEXT NOT NULL, FOREIGN KEY(User_Email) REFERENCES Users(Email))";
      db.run(sqlString);
      sqlString = "CREATE TABLE IF NOT EXISTS Contains (OrderNum INTEGER NOT NULL, ISBN INTEGER NOT NULL, Q_SOLD INT NOT NULL, SET_PRICE REAL NOT NULL, FOREIGN KEY(OrderNum) REFERENCES Orders(OrderNum), FOREIGN KEY(ISBN) REFERENCES Books(ISBN))";
	  db.run(sqlString);

	  db.run('INSERT OR REPLACE INTO Users VALUES("User1@gmail.com", "User1", "Secret", "U1 Billing Info", "U1 Shipping info", "Guest", 0)')
      db.run('INSERT OR REPLACE INTO Users VALUES("JohnOwner@gmail.com", "Owner", "Secret", "John Billing Info", "John Shipping info", "Admin", 0)')

	  db.run('INSERT OR REPLACE INTO Publishers VALUES("Ink&Paper@publishing.net", "Ink&Paper", "999-999-9999", "I&P Billing info", "Somewhere in Montreal, Canada")')
	  db.run('INSERT OR REPLACE INTO Publishers VALUES("BlankPage@publishing.net", "BlankPage", "987-654-3210", "BP Billing info", "Somewhere in Toronto, Canada")')

	  db.run('INSERT OR REPLACE INTO Books VALUES(1289, "BookTitle1", "John Author", "Fantasy", 15.89, 489, 10, 10, 8.2, 0, "Ink&Paper@publishing.net")')
	  db.run('INSERT OR REPLACE INTO Books VALUES(1984, "BookTitle2", "Billy Author", "Horror", 39.30, 800, 4, 1, 30, 0, "BlankPage@publishing.net")')

  });


  
exports.initDB = function(request, response, next){
	db.serialize();
	next();
}
exports.authenticate = function(request, response, next) {
	/*
	  Middleware to do BASIC http 401 authentication
	  */
	let auth = request.headers.authorization
	// auth is a base64 representation of (username:password)
	//so we will need to decode the base64
	if (!auth) {
	  //note here the setHeader must be before the writeHead
	  response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
	  response.writeHead(401, {
		'Content-Type': 'text/html'
	  })
	  console.log('No authorization found, send 401.')
	  response.end();
	} else {
	  console.log("Authorization Header: " + auth)
	  //decode authorization header
	  // Split on a space, the original auth
	  //looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
	  var tmp = auth.split(' ')
  
	  // create a buffer and tell it the data coming in is base64
	  var buf = Buffer.from(tmp[1], 'base64');
  
	  // read it back out as a string
	  //should look like 'ldnel:secret'
	  var plain_auth = buf.toString()
	  console.log("Decoded Authorization ", plain_auth)
  
	  //extract the userid and password as separate strings
	  var credentials = plain_auth.split(':') // split on a ':'
	  var username = credentials[0]
	  var password = credentials[1]
	  
	  
	  
	  console.log("User: ", username)
	  console.log("Password: ", password)
	  
  
	  var authorized = false
	  //check database users table for user
	  db.all("SELECT Username, Password, Role, Email FROM users", function(err, rows) {
		for (var i = 0; i < rows.length; i++) {
		  if (rows[i].Username == username & rows[i].Password == password) {
			  authorized = true;
			  request.email = rows[i].Email;
			  request.Username = username;
			  request.Role = rows[i].Role;
			  
			  break;
			  
		  }
		}
		if (authorized == false) {
		  //we had an authorization header by the user:password is not valid
		  response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
		  response.writeHead(401, {
			'Content-Type': 'text/html'
		  })
		  console.log('No authorization found, send 401.')
		  response.end()
		} else
		  next()
	  })
	}
  
	//notice no call to next()
  
  }
exports.index = function (request, response){
        // index.html

	    response.render('index', { title: 'Home', body: 'Logged in as: '+request.Role + " " +request.Username});

}

exports.reports = function(request, response){

}

exports.books = function(request, response){
	db.all("SELECT * FROM Books", function(err, books){
		if(books){
			console.log(books.length)
			response.render('books', {books})
		}
		else{
			response.render('index', {body: "No books in the DB"})
		}
	})
}

exports.getBook = function(request, response){
	console.log(request.path)
	let ISBN = request.query.ISBN;
	
	console.log(ISBN)
	if (ISBN){
		
		db.all('SELECT * FROM BOOKS WHERE ISBN='+ISBN, function (err, books){
			if (books){
				console.log("IN DB")
				console.log(books[0])
				response.contentType('application/json').json(JSON.stringify(books[0]))
				
				
			}
			else{
				console.log("Weird")
			}
		})
	}
}

exports.order = function(request, response){
	db.all("SELECT * FROM Books", function(err, books){
		if(books){
			console.log(books.length)
			response.render('order', {books})
		}
		else{
			response.render('index', {body: "No books in the DB"})
		}
	})
}

exports.sendOrder = function(request, response){
	console.log(request.body)
	let orderNum= Math.floor(Math.random() * 1000)
	let TPrice = 0;
	let orderBool = true;
	db.all("SELECT * FROM Books", function (err, books){
		for (let i = 0; i < books.length; i++){
			if (request.body[books[i].ISBN]){
				//Found our book
				if (request.body[books[i].ISBN].quantity > books[i].Quantity){
					orderBool = false;
				}
				else{
					TPrice += request.body[books[i].ISBN].price;
					
				}
				
			}
			
			
		}
		if (orderBool == true){
			console.log("Order being placed...")
			db.run('INSERT INTO Orders VALUES('+orderNum+', "BINFO", "SINFO", '+TPrice+', "'+request.email+'")')
			for (let i = 0; i < books.length; i++){
				if (request.body[books[i].ISBN]){
					db.run("INSERT INTO Contains VALUES("+orderNum+', '+books[i].ISBN+", "+request.body[books[i].ISBN].quantity+", "+request.body[books[i].ISBN].price+')')
					let newQuantity = Number(books[i].Quantity) - Number(request.body[books[i].ISBN].quantity)
					
					db.run("UPDATE Books SET Quantity = "+newQuantity + ' WHERE ISBN = '+books[i].ISBN)
					if (newQuantity < books[i].QT){
						console.log("------------------------")
						console.log("QUANTITY THRESHOLD REACHED FOR "+books[i].Title+", email sent to publisher to order "+(Number(books[i].QT) - newQuantity)+" more copies.")
						console.log("------------------------")
					}
				}
			}
			console.log("------------------------")
			console.log("Order successful")
			console.log("------------------------")
			
		}
	})
}


//Handlebar helpers

Handlebars.registerHelper("showBooks", function(books, options){
	var ret = '';
	
	
	for (var i = 0; i < books.length; i++){
		
		console.log(books[i])
		ret = ret + "<tr><td>"+books[i].ISBN +"</td>"
		ret = ret + "<td>"+books[i].Title +"</td>"
		ret = ret + "<td>"+books[i].Author +"</td>"
		ret = ret + "<td>"+books[i].Genre +"</td>"
		ret = ret + "<td>"+books[i].Publisher +"</td>"
		ret = ret + "<td>"+books[i].Price +"</td>"
		ret = ret + "<td>"+books[i].Quantity +"</td></tr>"
		//ret = ret + "</td>" +"<tr id='playlist" + i + "' title="+songs[i].trackID+'> <td style="background-color: #fbfbfb;" title="'+songs[i].image+'">' + '<img src=' + songs[i].image + ' alt="Album Artwork" width="30" height="30" >' + "</td>" + '<td style="background-color: #fbfbfb; width:20%;">' + songs[i].title + '</td>' + "<td style='background-color: #fbfbfb;'>" +songs[i].artist+ "<td style='background-color: #fbfbfb;'>" + '<button id="deleteBtn' + i + '" title="🗑️"></button>' + "</td>" + "<td style='background-color: #fbfbfb;'>" + '<button id="upBtn' + i + '"" title="⬆️"></button>' + "</td>" + "<td style='background-color: #fbfbfb;'>" + '<button id="downBtn' + i + '" title="⬇️"></button>' + "</td>"  
	}
	
	return ret;
});




