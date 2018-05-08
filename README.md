# CustomersTest 
This solution uses a MongoDB database, node and express to determine which users receive an invite. 
The criteria for receiving an invite is that the user must be located within 100km of Intercoms Dublin 
office. The algorithm for determining the distance can be found here: https://en.wikipedia.org/wiki/Great-circle_distance. 

<h3>Choosing JavaScript, NodeJs, and MongoDB</h3>
Javascript was choosen to keep the langage the same throughout the backend and potential front end, if it is needed. NodeJs was choosen as it is my personal preference currently and it allows for rapid development with express.js. MongoDB was used to eliminate the need to convert the original customer objects. 

<p>To improve this further, an index should be added to the distanceFromDublin field inside the customers collection. Further validations are required on user requests for the API routes to enhance security. Another API route that could be added would be to pass the search distance as a parameter.</p>

<p>To upload the original customers use: <b>node uploadCustomers.js</b></p>

To view the answers go to the answers directory and view <i>"customers-to-invite.json"</i>

To view the associated distances of all the customers go to the answers directory and view <i>"all-customers.json"</i>