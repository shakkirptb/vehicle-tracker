'use strict';

/**Tracking manager Object */
const VehicleTracker = function (map) {
    this.map = map;
    this.vehiclesTracked = {};
    this.cluster = null;

    this.init();

}
VehicleTracker.prototype.init = function () {
    //draw city boundaries
    if(this.circle){
        this.circle.setMap(null);
    }
    this.circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.75,
        strokeWeight: 0.4,
        fillColor: '#0000FF',
        fillOpacity: 0.02,
        map: this.map,
        center: CENTER,
        radius: RANGE * 1000
    });
    //initiate clustering
    if (this.cluster === null) {
        this.cluster = new MarkerClusterer(this.map, [], {
            imagePath: CLUSTER_CAR_IMG,
            minimumClusterSize: CLUSTER_MIN_SIZE,
            gridSize: CLUSTER_GRID_SIZE,
            maxZoom: 20,
            averageCenter: true
        });
    }
    //set rotational axis
    CarIcon.anchor = new google.maps.Point(25, 25),
    //zoom change event
    CarIcon.scale = calulateScale(map.getZoom());
    if(this.zoomEvent === undefined){
        this.zoomEvent=google.maps.event.addListener(map, 'zoom_changed', VehicleTracker.zoomChange.bind(this));
    }

}
//add vehicle for tracking
VehicleTracker.prototype.track = function (id, loc) {
    let vehicle = this.vehiclesTracked[id];
    if (vehicle === undefined) {
        //vehicle is not being tracked
        vehicle = new Vehicle(id, loc, this.map);
        this.vehiclesTracked[id] = vehicle;//new vehicle
        this.cluster.addMarker(vehicle.marker);
    } else {
        //already being tracked
        vehicle.moveTo(loc);
    }
}
//start tracking all
VehicleTracker.prototype.trackAll = function (locations) {
    if (locations) {
        let unTracked = new Set(Object.keys(this.vehiclesTracked));
        for (let id in locations) {
            let loc = locations[id];
            if (loc) { //add distace check here if it is need at front end
                this.track(id, loc)
                unTracked.delete(id);
            }
        }
        unTracked.forEach((id) => {
            this.stopTracking(id);
        })
    }
};
//stop tracking vehicle
VehicleTracker.prototype.stopTracking = function (id) {
    let vehicle = this.vehiclesTracked[id];
    if (vehicle) {
        if (this.cluster) {
            this.cluster.removeMarker(vehicle.marker);
        }
        vehicle.destroy();//remove marker
        delete this.vehiclesTracked[id];//stopTracking
    }
};
// zoom change event handler
VehicleTracker.zoomChange = function () {
    ZOOM_LEVEL = this.map.getZoom();
    CarIcon.scale = calulateScale(ZOOM_LEVEL)
    let tracked = this.vehiclesTracked;
    for (let id in tracked) {
        let v = tracked[id];
        let m = v.marker;
        m.icon.scale = CarIcon.scale;
        m.setIcon(m.icon);
    }
}

function calulateScale(zoom) {
    var i = ((Math.pow(zoom, 2)) - (zoom * 8)) / 100;
    return CAR_SIZE * (i > 1.5 ? 1.5 : (i < .3 ? .3:i))
}
