//code used from chat and sal
//added from chat for dynamic update using websocket
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const qs = require('querystring');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware to log all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// WebSocket server setup
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
    console.log('Client connected');
});

// Load product data from a JSON file
let products = require(__dirname + "/products.json");

// Serve product data as JavaScript
app.get('/products.js', function (request, response, next) {
    response.type('.js');
    let productsStr = `let products = ${JSON.stringify(products)};`;
    response.send(productsStr);
    console.log(productsStr);
});

// Parse POST data for processing purchases
app.use(express.urlencoded({
    extended: true
}));

// Initialize quantity sold for each product
for (let i in products) {
    products[i].qty_sold = 0; // Corrected this line
}

// Process purchase requests
app.post("/process_purchase", function (request, response) {
    let POST = request.body;
    let hasQty = false;
    let errorObject = {};

    // Iterate through products to validate quantities
    for (let i in products) {
        let qty = POST[`qty${i}`]; // Corrected this line
        hasQty = hasQty || (qty > 0);
        let errorMessages = validateQuantity(qty, products[i].qty_available);

        if (errorMessages.length > 0) {
            errorObject[`qty${i}_error`] = errorMessages.join(',');
        }
    }

    // Check if all quantities are valid before processing the purchase
    if (!hasQty && Object.keys(errorObject).length === 0) {
        response.redirect("./product_display.html?error");
    } else if (hasQty && Object.keys(errorObject).length === 0) {
        // Check quantities against the server's current state before processing the purchase
        const isValidPurchase = checkQuantitiesOnServer(POST);
        
        if (isValidPurchase) {
            // Update product quantities and broadcast changes
            for (let i in products) {
                let qty = POST[`qty${i}`];
                products[i].qty_sold += Number(qty);
                products[i].qty_available -= Number(qty); // Corrected this line
            }
            wss.broadcast(JSON.stringify(products));
            response.redirect("./invoice.html?valid&" + qs.stringify(POST));
        } else {
            // Redirect with an error message if quantities are no longer available on the server
            response.redirect("./product_display.html?unavailable");
        }
    } else if (Object.keys(errorObject).length > 0) {
        response.redirect("./product_display.html?" + qs.stringify(POST) + `&inputErr`);
    }
});

// Function to validate quantity entered by user against available quantity
function validateQuantity(quantity, availableQuantity) {
    let errors = [];

    quantity = Number(quantity);

    if (isNaN(quantity) && quantity !== '') {
        errors.push("Not a number. Please enter a non-negative quantity to order.");
    } else if (quantity < 0 && !Number.isInteger(quantity)) {
        errors.push("Negative quantity and not an Integer. Please enter a non-negative quantity to order.");
    } else if (quantity < 0) {
        errors.push("Negative quantity. Please enter a non-negative quantity to order.");
    } else if (quantity !== 0 && !Number.isInteger(quantity)) {
        errors.push("Not an Integer. Please enter a non-negative quantity to order.");
    } else if (quantity > availableQuantity) {
        errors.push(`We do not have ${quantity} available.`);
    }

    return errors;
}

// Function to check quantities against the server's current state
function checkQuantitiesOnServer(POST) {
    for (let i in products) {
        let qty = POST[`qty${i}`];
        if (Number(qty) > products[i].qty_available) {
            return false; // Return false if any quantity is no longer available on the server
        }
    }
    return true; // Return true if all quantities are valid
}

// Start the server; listen on port 8080 for incoming HTTP requests
server.listen(8080, () => console.log(`listening on port 8080`));


