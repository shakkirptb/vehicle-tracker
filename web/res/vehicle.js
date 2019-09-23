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
    this.marker= new SlidingMarker({
        position: location,
        map: map,
        icon: getCarIcon(location,CENTER),
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
            //moved
            this.marker.setIcon(getCarIcon(this.location,newLocation))
            this.location=newLocation;
            this.marker.setPosition(newLocation);
        }
    }
}
/**get car SVG icon for the given rotation */
function getCarIcon(from , to){
    CarIcon.rotation = getBearingAngle(from,to);
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
