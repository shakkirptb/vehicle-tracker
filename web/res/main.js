'use strict';
var map;
var tracker;

/**start of execution */
var timer;
function initMap() {
    clearTimer();
    //init map
    map = new google.maps.Map(document.getElementById('map'), {
        center: CENTER,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: ZOOM_LEVEL
    });
    google.maps.event.addListener(map, 'zoom_changed', zoomChange);
    //init Tracker
    tracker = new VehicleTracker(map);

    /**start timer */
    goLive();   
}
function zoomChange() {
    ZOOM_LEVEL = map.getZoom();
    let tracked = tracker.vehiclesTracked;
    for(let id in tracked){
        let v = tracked[id];
        let m = v.marker;
        m.icon.scale =  ZOOM_LEVEL/10;
        m.setIcon(m.icon);
    }
};
function goLive(){
    timer = setInterval(function () {
        console.log("ping..");
        requestLocations();
    }, UPDATE_RATE);
    /** testing stop after  a few min*/
    if(STOP_LIVE_AFTER !== 0){
        setTimeout(function () { clearTimer(); }, STOP_LIVE_AFTER);
    }
    
    $(timeBtn).html("Freeze");
}

/**ajax for location update */
function requestLocations() {
    $.ajax({
        url: LOCATIONS_REAST_URL,
        data: { center: CENTER, range: RANGE },
        method: "GET",
        contentType: "json",
        dataType: "json",
        success: function (data) {
            tracker.startTracking(data);
        }
    });
}

/** dashboard events*/
$(function () {
    $(txtRange).val(RANGE);
    $(txtCenter).val(JSON.stringify(CENTER));
});
function setRange() {
    RANGE = $(txtRange).val();
    initMap();
}
function setCenter() {
    CENTER = $(txtCenter).val();
    initMap();
}
function tougleFreeze(){
    if (timer) { 
        clearTimer();
    }else{
        goLive();
    }
}
function clearTimer() {
    if (timer) { 
        window.clearTimeout(timer); 
        timer=null;
        $(timeBtn).html("Go Live");
    }
}