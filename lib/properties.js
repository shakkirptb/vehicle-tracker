
module.exports = {
    APP_PORT: 3001,
    action: { UNREGISTER: 0, REGISTER: 1, UPDATE: 2, AWAY: 3 },
    CITY_CENTER: { lat: 52.53, lng: 13.403 },
    CITY_RANGE: 3.5,
    DB_UPDATE_INTERVAL:5000,
    DB_URL: "mongodb://127.0.0.1:27017/",
    DB_DB:"d2d",
    DB_COLLECTION:"locations"
}