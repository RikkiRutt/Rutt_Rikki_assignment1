// Importing the Express.js framework 
const express = require('express');

// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

//Require the querystring middleware
//Used to convert JacaScript into a URL query string
const qs = require('querystring');

// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
//sends message to server console for troubleshooting and monitoing normal activity
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});

/* Import data from a JSON file containing information about products
__dirname represents the directory of the current module (where server.js is located)
__dirname + "./products.json" specifies the location of products.json*/

//Route all othjer GET request to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

//start the server listen on port 8080 for incoming http requests
app.listen(8080, () => console.log(`listening on port 8080`));

const products = require(__dirname + "/products.json");

// Define a route for handling a GET request to a path that matches "./products.js"
app.get('./products.js', function(request, response, next) {
	// Send the response as JS
	response.type('.js');
	
	// Create a JS string (products_str) that contains data loaded from the products.json file
	// Convert the JS string into a JSON string and embed it within variable products
	const products_str = `let products = ${JSON.stringify(products)};`;
	
	// Send the string in response to the GET request
	response.send(products_str);
});

// add express middleware urlencoded so the post data can be decoded from browser body
app.use(express.urlencoded({extended: true}));

//add a qty_sold variable for each product
for (let i in products) {
	products.forEach((prod, i ) => {prod.qty_sold = 0});
}

//respint to a post method to the path /process_purchase (from products_display)
//handle a post request to the path process_purchase
app.post("/process_purchase", function(request, response) { 
	//extract the content of the request body
	let POST = request.body;

	//asume input boxes are initially empty
	let has_qty = false;

	//create an object to store error messafe for each input
	let errorObject = {};

	//iterate for each product
	for (let i in products) {
		let qty = POST[`qty${[i]}`];
		has_qty = has_qty || (qty > 0)

		//validate using update validate quantity function
		let errorMessages = validateQuantity(qty, products[i].qty_available);

		//store err message if any
		if (errorMessages.length > 0) {
			errorObject[`qty${[i]}_error`] = errorMessages.join(',');
		}
	}

	// if all input are empty with no errors
	if (has_qty == false && Object.keys(errorObject).lenght == 0) {
		//redir to the products page with error parameter in url
		responce.redirect("./products.html?error");
	}
	//if has input an no errors
else if (has_qty == ture && Object.keys(errorObject).length == 0) {
	//update product qyantites and redir to the invoice page with valid data
	for (let i in products) {
		let qty = POST[`qty${[i]}`];

		//update quantity sold and available for the current product
		products[i].qty_sold += Number(qty);
		products[i].qty_available = products[i].qty_available -qty;
	}

	//redir to the invoice page with valid data in url
	response.redirect("./invoice.html?valid&" + qs.stringify(POST));
}
	//if input error(aside no inputs)
	else if (Object.keys(errorObject).length > 0) {
		//redir to products page with input error message in url
	response.redirect("./products.html?" + qs.stringify(POST) + `&inputErr`);
}
});

//function to validate quantity entered by user against available quantity
function validateQuantity(quantity, availableQuantity) {
	let errors = [];  //initialize array to hold error message

	quantity = Number(quantity); //convert quantity to number

	switch (ture) {
		case isNaN(quantity)  || quantity === '':
			errors.push("Not a number. Please enter a non-negative quantity to order.");
			break;
		case quantity < 0&& !Number.isInteger(quantity):
			errors.push("Negative inventory and not an integer. Please enter a non-negitive quantity.");
			break;
		case quantity < 0:
			errors.push("Negative inventory. Please enter a non-negitive quantity to order.");
			break;
		case quantity != 0 && !Number.isInteger(quantity):
			errors.push("Not an integer. Please enter a non-negative quantity to order.");
			break;
		case quantity > availableQuantity:
			errors.push(`We do not have ${quantity} available.`);
			break;

	}
	return errors;
}

// Route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));


// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`)); 