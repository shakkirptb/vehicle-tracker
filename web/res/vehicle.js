'use strict';

const Vehicle = function(id,location,map){
    this.id=id;
    this.location=location;
    this.marker=null;
    //rest of the contructure code
    this.create(id,location,map);
   
}
/**create marker*/
Vehicle.prototype.create=function(id,location,map){
    this.angle=getBearingAngle(location,CENTER);
    this.marker= new SlidingMarker({
        position: location,
        map: map,
        icon: getCarIcon(this.angle),
        title: "Car: " + id,
        duration: UPDATE_RATE
    });  
}
/**remove marker from map */
Vehicle.prototype.destroy=function(){
    this.marker.setMap(null);
}
/**move marker */
Vehicle.prototype.moveTo=function(newLocation){
    if(this.location && newLocation){
        if(! isSame(this.location,newLocation)){
            this.marker.setPosition(newLocation);
            this.animateRotation(newLocation);
            this.location=newLocation;
        }
    }
}
/**gradual space transition with the help of sling marker*/
Vehicle.prototype.animateRotation = function(newLocation){
    //animate  space and angle transition;
    this.bearingTo =getBearingAngle(this.location,newLocation);
    this.angleToTurn = this.bearingTo-this.angle;
    this.angleToTurn = Math.abs(this.angleToTurn) > 180 ? -(360-this.angleToTurn) : this.angleToTurn;
    this.deltaAngle =   this.angleToTurn/10;
    startRotation(this);
}
/**performance improvement by avoiding many timers with one */
var rTimer =null;
var vehicles={};
var interval=100;
function startRotation(vehicle){
    vehicles[vehicle.id] = vehicle;
    if(rTimer == null){
        rTimer = setInterval(()=>{
            for(let id in vehicles){
                var v =  vehicles[id];
                v.angle = v.angle+v.deltaAngle;
                if(Object.keys(vehicles).length > 20 || //performance measure
                (v.deltaAngle > 0 && v.angle >= v.bearingTo)||
                v.deltaAngle < 0 && v.angle <= v.bearingTo){
                    v.angle=v.bearingTo;
                    delete vehicles[id];
                    if(Object.keys(vehicles).length==0){
                        clearInterval(rTimer);   
                        rTimer=null;                    
                    }
                }
                v.marker.setIcon(getCarIcon(v.angle));
            }  
        },interval); 
    }
}
/**get car SVG icon for the given rotation */
function getCarIcon(rotation){
    CarIcon.rotation = rotation;
    return CarIcon;
}
/**Manage clustering */
function isSame(loc1,loc2){
    return loc1.lat === loc2.lat && loc1.lng === loc2.lng
}
/**calculate bearing on movement */
function getBearingAngle(lastPosn, dest){
    let x = dest.lng - lastPosn.lng;
    let y = dest.lat - lastPosn.lat;
    return Math.round(Math.atan2(x,y)*57.296); // rad*180/pi;
}
