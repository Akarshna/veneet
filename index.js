//Order ID details and fetch Button= 10166408
const orderId = document.querySelector("#order-Id");
const fetchButton = document.querySelector("#fetch-btn");
const newOrderID = document.getElementById("neworderId");

// referencing Names, email, numbers, address, state, city

const firstName = document.getElementById("fName");
const lastName = document.getElementById("lName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const pincode = document.getElementById("pincode");
const city = document.getElementById("city");
const state = document.getElementById("state");
const address1 = document.getElementById("address-1");
const address2 = document.getElementById("address-2");
const orderDate = document.getElementById("order-date");

let items = [];
var invoiceNumber;
var invoiceDate;
var lineItems;
function getPaymentMode() {
  if (document.getElementById("cod").checked) {
    rate_value = document.getElementById("cod").value;
    return rate_value;
  }
  if (document.getElementById("prepaid").checked) {
    rate_value = document.getElementById("prepaid").value;
    return rate_value;
  }
}

// Package weight
const weight = document.getElementById("weight");
const length = document.getElementById("length");
const width = document.getElementById("width");
const height = document.getElementById("height");

const product = document.getElementsByClassName("product-name");
const sku = document.getElementsByClassName("sku");
const quantity = document.getElementsByClassName("quantity");
const total = document.getElementsByClassName("total");
const list = document.getElementById("generate-here");

function creator(lambai) {
  for (let i = 0; i < lambai; i++) {
    const htmlData = `         <li id="generate-here"> <input type="text" placeholder="Product Name" id="product-name1" class="product-name"/>
          <input type="text" placeholder="SKU"  id="sku1" class="sku" />
          <input type="text" placeholder="Quantity"  id="quantity1" class="quantity"/>
          <input type="text" placeholder="Total Price = Total + GST " id="total1" class="total" />
            </li>`;
    list.insertAdjacentHTML("afterend", htmlData);
  }
}

//Calling fetch order details
fetchButton.addEventListener("click", fetchOrderDetails);

function fetchOrderDetails() {
  let value = orderId.value;

  fetch(
    `https://bofrike.in/wp-json/wc/v3/orders/${value}?consumer_key=ck_16e49e7d4efcb1181f8eede87ac4afe982bcece4&consumer_secret=cs_c25df858dc9f92d85c9c2ecf28d0c94170f19a55`
  )
    .then((response) => response.json())
    .then((data) => converter(data));
}
function converter(data) {
  let billing = data.billing;

  firstName.value = billing.first_name;
  lastName.value = billing.last_name;
  email.value = billing.email;
  phone.value = billing.phone;
  address1.value = billing.address_1;
  address2.value = billing.address_2;
  city.value = billing.city;
  state.value = billing.state;
  pincode.value = billing.postcode;

  invoiceNumber = data.meta_data[20].value;

  invoiceDate = data.meta_data[19].value;

  lineItems = data.line_items;

  dataInjector(lineItems);
}

function dataInjector(lineItems) {
  if (lineItems.length >= 1) {
    let lambai = lineItems.length;
    creator(lambai);
    for (let i = 0; i < lambai; i++) {
      product[i].value = lineItems[i].name;
      sku[i].value = lineItems[i].product_id + "-" + lineItems[i].variation_id;
      quantity[i].value = lineItems[i].quantity;
      total[i].value =
        Number(lineItems[i].subtotal) + Number(lineItems[i].subtotal_tax);
    }
    // console.log(product.length);
  }
}
// array giver
function objectMaker(product) {
  items = [];
  for (let i = 0; i < product.length; i++) {
    if (product[i].value == "") {
      continue;
    }
    let pro = product[i].value;
    let sk = sku[i].value;
    let tot = total[i].value;
    let quan = quantity[i].value;
    let obiject = {
      product_name: pro,
      sku: sk,
      taxable_value: tot,
      
      quantity: quan,
      
    };
    items.push(obiject);
  }
}
function sabkaSum(total) {
  let sum = 0;
  for (let i = 0; i < total.length; i++) {
    sum = sum + Number(total[i].value);
  }
  return sum;
}
function createNewJson() {
  objectMaker(product);
  let jsonBorn = {
    seller_name: "Bofrike",
    seller_address:
      "LIG-52, SEC-32, CHANDIGARH ROAD, NEAR GREENLAND SCHOOL, LUDHIANA, 141008",
    seller_gst_tin: "03DPWPK4228G",
    
    consignee_gst_amount: 0,

    order_number: `${newOrderID.value}`,
    invoice_number: `${invoiceNumber}`,
    invoice_date: `${invoiceDate}`,

    consignee_name: `${firstName.value + " " + lastName.value}`,
    products_desc: "Clothing",
    payment_mode: getPaymentMode(),
    category_of_goods: "clothing",
    hsn_code: "",
    total_amount: sabkaSum(total),
    tax_value: 0,
    taxable_amount: sabkaSum(total),
    commodity_value: sabkaSum(total),
    cod_amount: sabkaSum(total),
    quantity: sabkaSum(quantity),

    weight: Number(weight.value),
    length:  Number(length.value),
    height:  Number(height.value),
    width:  Number(width.value),
   // return_reason: "",
    drop_location: {
      location_type: "Office",
      address: "LIG-52, SEC-32, CHANDIGARH ROAD, NEAR GREENLAND SCHOOL",
      city: "LUDHIANA",
      state: "PUNJAB",
      country: "INDIA",
      name: "BOFRIKE",
      phone: 8417077569,
      pin: 141008,
    },
    pickup_location: {
     "name": "LDH Office"
 },
    return_location: {
      "name": "LDH Office"
 },
    items: items,
  };
  return JSON.stringify(jsonBorn);
}

/**
 * Sample JavaScript code for sheets.spreadsheets.values.append
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/guides/code_samples#javascript
 */

function authenticate() {
  return gapi.auth2
    .getAuthInstance()
    .signIn({
      scope:
        "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets",
    })
    .then(
      function () {
        console.log("Sign-in successful");
      },
      function (err) {
        console.error("Error signing in", err);
      }
    );
}
function loadClient() {
  gapi.client.setApiKey("AIzaSyDtF_yZzwH81gthCCeIw-FFP8USrEl_xCA");
  return gapi.client
    .load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(
      function () {
        console.log("GAPI client loaded for API");
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
      }
    );
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: "1zZLNEVLXvb9yWuib54QECmqfB75XHuYv_A18fPIgI0s",
      range: "Sheet1!A1:A10",
      includeValuesInResponse: true,
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "RAW",
      resource: {
        values: [[createNewJson()]],
      },
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        console.log("Mission Successful");
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}
gapi.load("client:auth2", function () {
  gapi.auth2.init({
    client_id:
      "546418096344-8vsmv91ohem6d3d5p8bg67nqtlise8p9.apps.googleusercontent.com",
  });
});
