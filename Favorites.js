// function to set a Favorite City
function setFavorite(CityName,CityKey,CityObject) {

    if (localStorage.getItem("City"+CityKey) === null) { //This City is not a favorite
        CityObject.Name = CityName;
        CityObject.Key = CityKey;
        localStorage.setItem("City"+CityKey,  encodeURI(JSON.stringify(CityObject))  );
        Notification("Favorites Notification",CityName + " has been added to Favorites");
        return;
    }
    //City is already in favorites
    localStorage.removeItem("City"+CityKey);
    Notification("Favorites Notification",CityName + " has been removed from Favorites");
    return;
}


// function to Check a Favorite City
function IsFavorite(CityKey) {
    if (localStorage.getItem("City"+CityKey) === null) { //This City is not a favorite
        return false;
    }
    return true; //City is already in favorites
}
