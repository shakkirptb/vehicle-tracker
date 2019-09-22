'use strict';
var map;
const CENTER =  { lat: 52.53, lng: 13.403 };
const RANGE =3.5;
const CAR_CLUSTER = "img/cars-m";
const INIT_ZOOM=13;



const Vehicle = function(id,location){
    this.id=id;
    this.location=location;
    this.cluster=false;
    this.marker= new google.maps.Marker({
        position: location,
        map: map,
        icon: getCarIcon(getBearingAngle(location,CENTER)),
        title: "Car: " + id
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
            this.marker.setPosition(newLocation);
        }
    }else{
        //do nothing 
    }
}
const VehicleTracker={
    vehiclesTracked :{
    },
    startTracking:function(data){
        if(data){
            let unTracked = new Set(Object.keys(this.vehiclesTracked));
            for(let id in data){
                let loc=data[id];
                if(loc && getDistance(CENTER,loc) <= RANGE){
                    let vehicle= this.vehiclesTracked[id];
                    //vehicle is in the 3.5 km range
                    if(vehicle===undefined){
                        //vehicle is not being tracked
                        vehicle = new Vehicle(id,loc);
                        this.vehiclesTracked[id] = vehicle;//new vehicle
                        this.cluster.addMarker(vehicle.marker);               
                    }else{
                        //already being tracked
                        vehicle.moveTo(loc);
                    }
                    unTracked.delete(id);
                }
            }
            unTracked.forEach((id)=>{
                this.stopTracking(id);
            })
        }

    },
    stopTracking:function(id){
        let vehicle = this.vehiclesTracked[id];
        if(vehicle instanceof Vehicle){
            if(this.cluster){
                this.cluster.removeMarker(vehicle.marker);
            }
            vehicle.destroy();//remove marker
            delete this.vehiclesTracked[id];//stopTracking
        }
    },
    cluster:null,
    init:function(){
        
        //initiate clustering
        if(this.cluster === null){
            this.cluster =  new MarkerClusterer(map, [],{
                imagePath: CAR_CLUSTER,
                minimumClusterSize:3,
                gridSize:70,
                maxZoom:18,
                averageCenter:true
            });
        }

       
    }
}

/**Manage clustering */
function isSame(loc1,loc2){
    return loc1.lat === loc2.lat && loc1.lng === loc2.lng
}
function getBearingAngle(lastPosn, dest){
    let x = dest.lng - lastPosn.lng;
    let y = dest.lat - lastPosn.lat;
    return Math.round(Math.atan2(x,y)*57.3); // rad*180/pi;
}
function getDistance(loc1,loc2){
    try{
        let lat1 = loc1.lat,lon1 = loc1.lng,lat2 = loc2.lat,lon2 = loc2.lng;
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
    return deg * (Math.PI/180)
}

/**ajax for location update */
function requestLocation(){
    $.ajax({
        url:"/vehicles/locations",
        method: "GET",
        dataType: "json",
        success: function (data) {
            VehicleTracker.startTracking(data);
        }
    });
}
/**start of execution */
function initMap() {
    //init map
    map = new google.maps.Map(document.getElementById('map'), {
        center: CENTER,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: INIT_ZOOM
    });

    //init Tracker
    VehicleTracker.init();
    
     /**poling continuosly for verhicle stats */
     requestLocation();
     var timer = setInterval(function(){
         console.log("ping..");
         requestLocation();
     },3000);
     /** testing stop after  a few min*/
     setTimeout(function(){window.clearTimeout(timer)},180000);
}


