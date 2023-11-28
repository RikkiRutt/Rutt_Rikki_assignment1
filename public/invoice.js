//code used from sal and bing chat gpt
// Get the URL
let params = (new URL(document.location)).searchParams;


// On load, if there is no 'valid' key, redirect the user back to the Home page
window.onload = function() {
    if (!params.has('valid')) {
        document.write(`
            <head>
                <link rel="stylesheet" href="syle.css">
            </head>
            <body style="text-align: center; margin-top: 10%;">
                <h2>ERROR: No form submission detected.</h2>
                <h4>Return to <a href="index.html">Home</a></h4> 
            </body>
        `)
    }
}

let subtotal = 0;

let qty = [];
for (let i in products) {
    qty.push(params.get(`qty${i}`));
}

for (let i in qty) {
    if (qty[i] == 0 || qty[i] == '') continue;

    extended_price = (params.get(`qty${i}`) * products[i].price).toFixed(2);
    subtotal += Number(extended_price);

    document.querySelector('#invoice_table').innerHTML += `
        <tr style="border: none;">
            <td width="10%"><div class="icon"><img src="${products[i].image}" alt="${products[i].alt}" style="border-radius: 5px;width: 200px; height: 150px;"><div class="popup">${products[i].model}</div>
            </div></td>
            <td><strong>${products[i].model}<strong></td>
            <td>${qty[i]}</td>
            <td>${products[i].qty_available}</td>
            <td>$${products[i].price.toFixed(2)}</td>
            <td>$${extended_price}</td>
        </tr>
    `;
}

// Sales tax
let tax_rate = (4.7/100);
let tax_amt = subtotal * tax_rate;

// Shipping
if (subtotal < 300) {
    shipping = 5;
    shipping_display = `$${shipping.toFixed(2)}`;
    total = Number(tax_amt + subtotal + shipping);
}
else if (subtotal >= 300 && subtotal < 500) {
    shipping = 10;
    shipping_display = `$${shipping.toFixed(2)}`;
    total = Number(tax_amt + subtotal + shipping);
}
else {
    shipping = 0;
    shipping_display = 'FREE';
    total = Number(tax_amt + subtotal + shipping);
}

document.querySelector('#total_display').innerHTML += `
    <tr style="border-top: 2px solid black;">
        <td colspan="5" style="text-align:center;">Sub-total</td>
        <td>$${subtotal.toFixed(2)}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;">Tax @ ${Number(tax_rate) * 100}%</td>
        <td>$${tax_amt.toFixed(2)}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;">Shipping</td>
        <td>${shipping_display}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;"><b>Total</td>
        <td><b>$${total.toFixed(2)}</td>
    </tr>
`;




/*calculate subtotal
let subtotal = extended_price1 + extended_price2 + extended_price3 + extended_price4 + extended_price5;

calcuate sales tax
let taxRate = 0.0575;  // 5.75%
let taxAmount = subtotal * taxRate;

//calculate shipping
let shippingCharge = 0
if (subtotal <= 50)
{
    shippingCharge = 2
} //lest then$50 is $2
else if (subtotal <= 100) 
{
    shippingCharge = 5
} //$50 to $99.99 is $5
else
{
    shippingCharge= subtotal * 0.05 //5% of subtotal
} //more then $100 is 5% of subtotal
//calculate total
let total = subtotal + taxAmount + shippingCharge;

//populate the table rows using dom manipulation
let table = document.getElementById('invoiceTable');

let row = invoiceTable.insertRow(); //create new row for each item
row.insertCell(0).innerHTML = `${item1}`; 
row.insertCell(1).innerHTML = `${quantity1}`;
row.insertCell(2).innerHTML = `$` + `${price1}`;
row.insertCell(3).innerHTML = (`$` + `${extended_price1}`);
row = invoiceTable.insertRow(); //create new row for each item
row.insertCell(0).innerHTML = `${item2}`; 
row.insertCell(1).innerHTML = `${quantity2}`;
row.insertCell(2).innerHTML = `$` + `${price2}`;
row.insertCell(3).innerHTML = (`$` + `${extended_price2}`);
row = invoiceTable.insertRow(); //create new row for each item
row.insertCell(0).innerHTML = `${item3}`; 
row.insertCell(1).innerHTML = `${quantity3}`;
row.insertCell(2).innerHTML = `$` + `${price3}`;
row.insertCell(3).innerHTML = (`$` + `${extended_price3}`);
row = invoiceTable.insertRow(); //create new row for each item
row.insertCell(0).innerHTML = `${item4}`; 
row.insertCell(1).innerHTML = `${quantity4}`;
row.insertCell(2).innerHTML = `$` + `${price4}`;
row.insertCell(3).innerHTML = (`$` + `${extended_price4}`);
row = invoiceTable.insertRow(); //create new row for each item
row.insertCell(0).innerHTML = `${item5}`; 
row.insertCell(1).innerHTML = `${quantity5}`;
row.insertCell(2).innerHTML = `$` + `${price5}`;
row.insertCell(3).innerHTML = (`$` + `${extended_price5}`);

//set subt, tax and total cells
document.getElementById(`subtotal_cell`).innerHTML = `$` + subtotal.toFixed(2);
document.getElementById(`tax_cell`).innerHTML = `$` + taxAmount.toFixed(2);
document.getElementById(`shipping_cell`).innerHTML = `$` + shippingCharge.toFixed(2);
document.getElementById(`total_cell`).innerHTML = `$` + total.toFixed(2);
*/