'use strict';

const Vehicle = function (id, location, map) {
    this.id = id;
    this.location = location;
    this.marker = null;
    //rest of the contructure code
    this.create(id, location, map);

}
/**create marker*/
Vehicle.prototype.create = function (id, location, map) {
    this.angle = getBearingAngle(location, CENTER);
    this.marker = new google.maps.Marker({
        position: location,
        optimized: false,
        map: map,
        icon: getCarIcon(this.angle),
        title: "Car: " + id,
        duration: UPDATE_RATE
    });
}
/**remove marker from map */
Vehicle.prototype.destroy = function () {
    this.marker.setMap(null);
}
/**gradual space transition with the help of sling marker*/
var precision = 30;
var anglePrec = 10;
/**move marker */
Vehicle.prototype.moveTo = function (newLocation) {
    if (this.location && newLocation) {
        if (!isSame(this.location, newLocation)) {
             //animate displacement
            this.newLocation = newLocation;
            this.dLat = (newLocation.lat - this.location.lat)/precision;
            this.dLng = (newLocation.lng - this.location.lng)/precision;
            //animate bearing/angle transition;
            this.bearingTo = getBearingAngle(this.location, newLocation);
            this.angleToTurn = this.bearingTo - this.angle;
            this.angleToTurn = Math.abs(this.angleToTurn) > 180 ? (this.angle >= 0 ? (360 - this.angleToTurn):-(360 - this.angleToTurn)) : this.angleToTurn;
            this.deltaAngle = this.angleToTurn/ anglePrec;//angle should change faster for better visual experience
            //
            animateVehicle(this);
        }
    }
}
/**performance improvement by avoiding many timers with one */
var rTimer = null;
var animVehicles = {};
var interval = 30;
function animateVehicle(vehicle) {
    animVehicles[vehicle.id] = vehicle;
    if (rTimer == null) {
        rTimer = setInterval(() => {
            for (let id in animVehicles) {
                var v = animVehicles[id];
                //animation for latitude completed?
                let latMoved = (v.dLat > 0 && v.location.lat >= v.newLocation.lat) || v.dLat < 0 && v.location.lat <= v.newLocation.lat;
                if (!latMoved) {
                    v.location.lat += v.dLat;//increment lat
                }
                //animation for longitude completed?
                let lngMoved = (v.dLng > 0 && v.location.lng >= v.newLocation.lng) || v.dLng < 0 && v.location.lng <= v.newLocation.lng;
                if (!lngMoved) {
                    v.location.lng += v.dLng;//increment lng
                }
                if (!latMoved || !lngMoved) {
                    v.marker.setPosition(v.location);
                }
                //animation for angle completed?
                let turned = (v.deltaAngle > 0 && v.angle >= v.bearingTo) || v.deltaAngle < 0 && v.angle <= v.bearingTo;
                if (!turned) {
                    v.angle += v.deltaAngle;//increment angle
                    v.marker.setIcon(getCarIcon(v.angle));
                }
                //------
                if (latMoved && lngMoved && turned) {
                    v.angle = v.bearingTo;
                    v.location=v.newLocation;
                    delete animVehicles[id];
                    if (Object.keys(animVehicles).length == 0) {
                        clearInterval(rTimer);
                        rTimer = null;
                    }
                    v.marker.setIcon(getCarIcon(v.angle));
                    v.marker.setPosition(v.location);
                }
                //------
            }
        }, interval);
    }
}
/**get car SVG icon for the given rotation */
function getCarIcon(rotation) {
    CarIcon.rotation = rotation;
    return CarIcon;
}
/**Manage clustering */
function isSame(loc1, loc2) {
    return loc1.lat === loc2.lat && loc1.lng === loc2.lng
}
/**calculate bearing on movement */
function getBearingAngle1(lastPosn, dest) {
    /**bearing on 2D/plane */
    let x = dest.lng - lastPosn.lng;
    let y = dest.lat - lastPosn.lat;
    return Math.round(rad2deg(Math.atan2(x, y))*100)/100; // rad*180/pi;
}
/**bearing on globe */
function getBearingAngle(lastPosn, dest) {
    let l2 = rad2deg(dest.lng);
    let l1= rad2deg(lastPosn.lng);
    let f2 = rad2deg(dest.lat);
    let f1 = rad2deg(lastPosn.lat);
    var y = Math.sin(l2-l1) * Math.cos(f2);
    var x = Math.cos(f1)*Math.sin(f2) - Math.sin(f1)*Math.cos(f2)*Math.cos(l2-l1);
    return  Math.round(rad2deg(Math.atan2(y, x))*100)/100;
}
function rad2deg(red) {
    return red * 57.296;
}
