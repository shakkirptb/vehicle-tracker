# vehicle-tracker
## How to use?

1. download/check-out the [vehicle-tracker](https://github.com/shakkirptb/vehicle-tracker/blob/master/ "vehicle-tracke") code to you computer
2. Edit [properties.js](https://github.com/shakkirptb/vehicle-tracker/blob/master/lib/properties.js "properties.js") and configure the bac-end such as App post, database connection URL etc,  default value should suffice mostly. similarly you can edit [globals.js](https://github.com/shakkirptb/vehicle-tracker/blob/master/web/res/globals.js "globals.js") for configuring front-end.
3. Edit [index.html ](https://github.com/shakkirptb/vehicle-tracker/blob/master/web/index.html "index.html ")  and search for `MAP_API_KEY` add replace it with your google map's API key and save the file
4. go to the [root folder](https://github.com/shakkirptb/vehicle-tracker/blob/master/ "root folder") where package.json is located and open the terminal and execute `>npm start`. this should start the Node.js App and it will now listen to port 3001
5.  Open the Chrome browser and open URL http://localhost:3001/ and the you'll see Vehicle Visualizer app with the map and some additional controls to modify center, coverage etc.
6.  send vehicle update requests to the application as explained in the [documentation](https://github.com/door2door-io/d2d-code-challenges/tree/master/fullstack "documentation") or dowload the [simulator](https://github.com/door2door-io/d2d-code-challenges/tree/master/resources/driver-simulator "simulator") app and start it by executing  `node simulate localhost:3001` now you should see  moving cars in the Visualizer. also each location update will be saved to the DB.

#### Assumptions
1.  You have mongoDB v4.2 with a database named **d2d** and collection named **locations** and the DB is up and running.
2. you have a Google map API KEY and it should be enabled for the domain where you are running the vehicle visualization
