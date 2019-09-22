const props = require("./properties");
const { MongoClient } = require("mongodb");

var colLoc;
(async function () {
    try {
        var client = await MongoClient.connect(props.DB_URL,
            { 
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                reconnectTries: 60,
                reconnectInterval: 1000,
            });
        colLoc = client.db(props.DB_DB).collection(props.DB_COLLECTION);
        console.log("MongoDB connected..");
    } catch (e) {
        console.error(e)
    }
})();


var readyToSave = true;

/**to be saved to db */
var locationHistory = [];

function insert(doc) {
    locationHistory.push(doc);

    //if timer active, ignore
    if (readyToSave) {
        readyToSave = false;
        //save a bunch of items in intervals
        timer = setTimeout(() => {
            var temp = locationHistory;
            //clear history
            locationHistory = [];
            //save collected location history to db
            insertBatch(temp, () => {
                readyToSave = true;
                console.info("Batch saved..")
            });
        }, props.DB_UPDATE_INTERVAL);
    }


}
function insertBatch(docs, callback) {
    colLoc.insertMany(docs, function (err) {
        if (err) {
            console.log("insertion failed, ERROR:" + err.code);
        }
        callback();
    });
}
module.exports = {
    insert: insert
}