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
    
    //init Tracker
    tracker = new VehicleTracker(map);
    
    /**start timer */
    goLive();   
}

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
            tracker.trackAll(data);
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
    tracker.init();
    requestLocations();
}
function setCenter() {
    CENTER = JSON.parse($(txtCenter).val());
    tracker.init();
    requestLocations();
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