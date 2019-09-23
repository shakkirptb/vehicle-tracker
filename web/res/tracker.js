'use strict';

/**Tracking manager Object */
const VehicleTracker = function (map) {
    this.map = map;
    this.vehiclesTracked = {};
    this.cluster = null;

    this.init();

}
VehicleTracker.prototype.init = function(){
    //draw city boundaries
    new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.75,
        strokeWeight: 0.4,
        fillColor: '#0000FF',
        fillOpacity: 0.02,
        map: this.map,
        center: CENTER,
        radius: RANGE*1000
      });
    //initiate clustering
    if (this.cluster === null) {
        this.cluster = new MarkerClusterer(this.map, [], {
            imagePath: CLUSTER_CAR_IMG,
            minimumClusterSize: CLUSTER_MIN_SIZE,
            gridSize: CLUSTER_GRID_SIZE,
            maxZoom: 18,
            averageCenter: true
        });
    }
}
VehicleTracker.prototype.startTracking = function (data) {
    if (data) {
        let unTracked = new Set(Object.keys(this.vehiclesTracked));
        for (let id in data) {
            let loc = data[id];
            if (loc) { //add distace check here if it is need at front end
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
                unTracked.delete(id);
            }
        }
        unTracked.forEach((id) => {
            this.stopTracking(id);
        })
    }
};
VehicleTracker.prototype.stopTracking = function (id) {
    let vehicle = this.vehiclesTracked[id];
    if (vehicle instanceof Vehicle) {
        if (this.cluster) {
            this.cluster.removeMarker(vehicle.marker);
        }
        vehicle.destroy();//remove marker
        delete this.vehiclesTracked[id];//stopTracking
    }
};
