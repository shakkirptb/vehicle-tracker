# vehicle-tracker
## How to use?

1. download/check-out vehicle-tracker to you computer
2. Edit [properties.js](https://github.com/shakkirptb/vehicle-tracker/blob/master/lib/properties.js "properties.js") and configure the follwing it if such as database connection URL default value should suffice mostly
{
    APP_PORT: 3001,
    action: { UNREGISTER: 0, REGISTER: 1, UPDATE: 2, AWAY: 3 },
    CITY_CENTER: { lat: 52.53, lng: 13.403 },
    CITY_RANGE: 3.5,
    DB_UPDATE_INTERVAL: 5000,
    DB_URL: "mongodb://127.0.0.1:27017/",
    DB_DB:"d2d",
    DB_COLLECTION:"locations"
	}
3. Edit [index.html ](https://github.com/shakkirptb/vehicle-tracker/blob/master/web/index.html "index.html ")  and search for `MAP_API_KEY` add replace it with your google map's API key and save the file
4. go to the [root folder](https://github.com/shakkirptb/vehicle-tracker/blob/master/ "root folder") where package.json is located and open the terminal and execute `>npm start`. this should start the Node.js App and it will now listen to port 3001
5.  Open the Chrome browser and open URL http://localhost:3001/ and the you'll see the in a map with additional control to modify center, coverage etc.
6.  send vehicle update requests to as explained in the [documentation](https://github.com/door2door-io/d2d-code-challenges/tree/master/fullstack "documentation") or dowload the [simulator](https://github.com/door2door-io/d2d-code-challenges/tree/master/resources/driver-simulator "simulator") app and start it by executing  `node simulate localhost:3001` now you should see  moving cars in the Visualizer.

### Assumptions
1.  You have mongoDB v4.2 with a database name **d2d** and collection named **locations** and the DB is up and running.
2. you have a Google map API KEY and it should be enabled for the host url where you are running the vehicle tracker ao
