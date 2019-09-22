'use strict';
const express = require('express');
const router = express.Router();
const props=require("./properties");
const db = require("./database");


/**registered  + inside city */
const activeVehicles = {};
/**registered but not inside city */
const inactiveVehicles=new Set([]);


/**Deliver HTML */
router.use(express.static('web'))

/**get active vehicle's location */
router.get('/vehicles/locations', (req, res) => {
    res.send(activeVehicles);
});
/**register vehicle */
router.post('/vehicles', (req, res) => {
    let id= req.body["id"];  
    //registering new vehicle 
    if(updateVehicleStats(id,props.action.REGISTER)){
        //console.info("vehicle registered " + id);
        res.sendStatus(204);
    }else{
        console.error("vehicle already registered " + id);
        res.sendStatus(422);
    }
});
/**unregister vehicle */
router.delete('/vehicles/:id', (req, res) => {
    let id= req.params["id"];
    //unregister vehicle 
    if(updateVehicleStats(id,props.action.UNREGISTER)){
        //console.info("vehicle un-registered " + id);
        res.sendStatus(204);      
    }else{
        console.error("already unregistered or invalid vehicle " + id);
        res.sendStatus(422);
    }
});
/**location update */
router.post('/vehicles/:id/locations', (req, res) => {
    let id= req.params["id"];   
    let newLocation = req.body;
    if(id && newLocation && updateVehicleStats(id,newLocation)){
        //console.info("vehicle updated " + JSON.stringify(activeVehicles[id]));
        res.sendStatus(204);
    }else{
        console.error("vehicle not registered " + id);
        res.sendStatus(422);
    }
});

function updateVehicleStats(id,newLocation){
    let oldLocation = activeVehicles[id];
    if(newLocation === props.action.REGISTER){
        //new vehicle
       saveLocation(id,null,props.action.REGISTER);//update db;
        if(oldLocation === undefined){
            inactiveVehicles.add(id);
            delete activeVehicles[id];
            return true;
        }
        //update db;
        return false;
    }else
    if(newLocation === props.action.UNREGISTER){
        //delete vehicle
        saveLocation(id,null,props.action.UNREGISTER);//update db;//update db;
        if(oldLocation === undefined){
            return false;
        }
        inactiveVehicles.delete(id);
        delete activeVehicles[id];
        return true;
    }else
    if(oldLocation === null || oldLocation || inactiveVehicles.has(id)){
        if(getDistance(props.CITY_CENTER,newLocation) <= props.CITY_RANGE){
            //update location
            inactiveVehicles.delete(id);
            activeVehicles[id]=newLocation;
            saveLocation(id,newLocation,props.action.UPDATE);//update db;
        }else{
            inactiveVehicles.add(id);
            delete activeVehicles[id];
            saveLocation(id,newLocation,props.action.AWAY);//update db;
        }
        return true;
    }else{
        console.error("vehicle not registered " + id);
       return false;
    }
}
function saveLocation(id,loc,action){
    db.insert( {
        vid:id,
        location:loc||null,
        action:action
    });
}
function getDistance(loc1,loc2){
    try{
        var lat1 = loc1.lat,lon1 = loc1.lng,lat2 = loc2.lat,lon2 = loc2.lng;
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;           
    }catch(e){
        console.error("invalid locations");
        return null;
    }
}
function deg2rad(deg) {
    return deg * (Math.PI/180);
}

module.exports = router;