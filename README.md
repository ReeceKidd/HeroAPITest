# Running the project

To run the project, download a local copy and run <b>node node_modules/nodemon/bin/nodemon.js src/app.js -M=[merchantID]</b><br> 

A valid example is: <b>node node_modules/nodemon/bin/nodemon.js src/app.js -M=YcxOCwj0jg</b><br>

A mongod instance will need to be run before the 
application will launch successfully. If it's easier I can provide an Ngrok URL to test the API. 

# Tests

To test the project go to the "tests" sub folder and run the following command on each of the files: <b>"mocha [fileName] --timeout=0"</b>. Their are 100+ API tests, I can take the validation further if its required. 

# CustomersTest 
This solution uses a MongoDB database, node and express to offer various API routes related to a retail store.  

# Interpretation 
My interpretation of the problem was to create an API that allows users to get products and retreive products from both a MongoDB database and the heroAPI. It allows for merchants to get a summary of their own events, and offers the ability to return all events that have occured.  <br>

# Available API routes. 
<b>Events Routes</b><br>
routes.post('/create-event', eventsController.createEvent)<br>
routes.get('/events/:merchantID', eventsController.summaryOfEvents)<br>
routes.get('/events', eventsController.getAllEvents)<br>

Additional event routes that could be added are the ability to refund or cancel a transaction. 
May have misinterpreted this it might be better to have a call to the productAPI inside of this based on 
the SKU code to populate the product data. It may also be desirable for the server to calculate the price. 

<b>Merchant Routes</b><br>
routes.get('/merchants', merchantController.getMerchants)<br>
routes.get('/merchants/:merchantID', merchantController.getSpecificMerchant)<br>
routes.post('/register-merchant', merchantController.registerMerchant)<br>

Additional merchant routes that could be added, would be the ability to delete merchants or disassociate products. 
<br>

<b>Products Routes</b>
//Products Routes
routes.get('/products', productsController.getAllProducts)<br>
routes.get('/products/:skuCode', productsController.getSpecificProduct)</br>
routes.post('/register-product', productsController.registerProduct)<br>

Additional product routes could be to find the merchants details associated with project. 
<br>

<b>User routes</b>
routes.get('/users', userController.getUsers)<br>
routes.get('/users/:userID', userController.getSpecificUser)<br>
routes.post('/register-user', userController.registerUser)<br>

Additional user routes could be to delete users. 








