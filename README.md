# Running the project

To run the project, download a local copy and run <b>"npm start"</b>

# Tests

To test the project go to the "tests" sub folder and run the following command on each of the files: <b>"mocha [fileName] --timeout=0"</b>. There are 90 something API tests I could take the validation further if its required. 

# CustomersTest 
This solution uses a MongoDB database, node and express to offer various API routes related to a retail store.  

# Interpretation 
My interpretation of the problem was to create an API that allows users to get products and for users and merchants
to register, and return information. <br>

I'm aware that the instructions said to use the existing API but I didn't get any information returned using the /products
call. I also didn't have the port information. If I have misinterpreted I'd be more than happy to give it another go. If this 
isn't what you were looking for thank you for the opportunity anyway. I'm more than happy to take on all feedback. 

# Available API routes. 
<b>Events Routes</b><br>
routes.post('/create-event', eventsController.createEvent)<br>
routes.get('/events/:merchantID', eventsController.summaryOfEvents)<br>
routes.get('/events', eventsController.getAllEvents)<br>

Additional event routes that could be added are the ability to refund or cancel a transaction. 

<b>Merchant Routes</b><br>
routes.get('/merchants', merchantController.getMerchants)<br>
routes.get('/merchants/:merchantID', merchantController.getSpecificMerchant)<br>
routes.post('/register-merchant', merchantController.registerMerchant)<br>

Additional merchant routes that could be added, would be the ability to delete merchants or disassociate products. 
<br>

<b>Products Routes</b>
routes.get('/products', productsController.getAllProducts)<br>
routes.get('/products/:skuCode', productsController.getSpecificProduct)<br>
routes.post('/register-product', productsController.registerProduct)<br>

Additional product routes could be to find the merchants details associated with project. 
<br>
<b>User routes</b>
routes.get('/users', userController.getUsers)<br>
routes.get('/users/:userID', userController.getSpecificUser)<br>
routes.post('/register-user', userController.registerUser)<br>

Additional user routes could be to delete users. 





