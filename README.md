#AVAST Reporting API
##Overview
This project contains the code used for the PlumChoice AVAST reporting API project. This is a very simple REST WS written in Node.js using mainly Express.
##Installation
	npm install
This project has package.json setup to pull down all the necessary libraries.
##Starting Up Server
	node app.js
This will start the server on your local on port 3000.
###REST Web Service Operations
Please see [this](http://docs.avast.apiary.io/) URL for how the server works.
##Running Tests
###Main Test
	node test/app-test.js
The above line should come back looking as follows:  

	······ ✓ OK » 4 honored (0.036s)
	······ ✓ OK » 4 honored (0.041s) 
	···· ✓ OK » 8 honored (0.044s)
###Refresh Test
	node test/app-token-refresh-test.js
The above line should come back looking as follows:  

	···· ✓ OK » 4 honored (0.023s) 
	

