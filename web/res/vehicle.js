'use strict';

const Vehicle = function(id,location,map){
    this.id=id;
    this.location=location;
    this.cluster=false;
    this.marker= new SlidingMarker({
        position: location,
        map: this.map,
        icon: getCarIcon(getBearingAngle(location,CENTER)),
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
            this.marker.setIcon(getCarIcon(getBearingAngle(this.location,newLocation)))
            this.location=newLocation;
            // moveSmooth(this.marker,this.location,newLocation)
            this.marker.setPosition(newLocation);
        }
    }else{
        //do nothing 
    }
}

/**Manage clustering */
function isSame(loc1,loc2){
    return loc1.lat === loc2.lat && loc1.lng === loc2.lng
}
/**calculate bearing on movement */
function getBearingAngle(lastPosn, dest){
    let x = dest.lng - lastPosn.lng;
    let y = dest.lat - lastPosn.lat;
    return Math.round(Math.atan2(x,y)*57.3); // rad*180/pi;
}
