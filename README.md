# Herolo Weather Home Assignment

The app contains 2 pages , weather and favorites.
The resources are being loaded at the index.html , page flow is controlled by state management.

On the weather page :
1) Autocomplete api call occurs on a key press to update the jquery autocomplete source.
2) 2 other api calls occur when a city is selected to receive the full data , and forecast for the next 5 days.

On the favorites page :
1) All the cities added by the user as favorites will be shown with their current weather state.
2) On click user will be navigated back to the weather page of the chosen favorite. 

Side Navigation will allow changing Theme and Unit type , which will be saved in Local Storage as the user's preferences.

Error handling is done using Modal , also a message will pop up when a city is added\removed from favorites.

Responsive design is applied.

*No mobile view required. Alse search on a mobile will not work due to "Desktop app" on accuWeather.
*Creating a new "mobile app" on accuWeather is possible, it will require to make a check in the controller for mobile devices and change the provided Key (by accuWeather);

made by Daniel Zagorsky.
