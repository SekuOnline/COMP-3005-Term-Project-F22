David Sedarous
SID: 101202877
December 11 2022
COMP 3005 Term Project Implementation

dependancies: jquery, express, hbs, sqlite3

to run:
:npm install
:node ./server.js


Default users can be used to login:
	An owner user: 	username: Owner 	password: Secret
	A guest user:	username: User1		password: Secret

Notes;
	- Reports were not implemented.
	- Automatic emails sent to the publisher when the quantity threshold is reached is shown on the server console.
	- To place an order: Choose the ISBN and quantity to order, add it to the order, then press Place Order.
		A few order details are logged on the server console.
	- Currently the DBs will reset after the server closes and reopens. This was done for ease of testing, and can be changed by removing "REPLACE" from db.serialize.
