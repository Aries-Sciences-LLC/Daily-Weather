// WEATHER ICON TRANSLATOR FORMAT
//
// 01d -> wi-day-sunny
// 01n -> wi-night-clear
// 02d -> wi-day-cloudy
// 02n -> wi-night-alt-cloudy
// 03d -> wi-cloudy
// 03n -> wi-cloudy
// 04d -> wi-cloudy-gusts
// 04n -> wi-cloudy-gusts
// 09d -> wi-day-rain-mix
// 09n -> wi-night-alt-showers
// 10d -> wi-day-rain
// 10n -> wi-night-alt-rain-wind
// 11d -> wi-day-sleet-storm
// 11n -> wi-night-alt-sleet-storm
// 13d -> wi-day-snow
// 13n -> wi-night-alt-snow
// 50d -> wi-windy
// 50n -> wi-windy

fullScreen();

var was_offline_before = false;
var user_location = { lat: undefined, lon: undefined };
var weather_data = [["Morning", "Day", "Evening", "Night"], // Icon
                    ["Morning", "Day", "Evening", "Night"], // Type
                    ["Morning", "Day", "Evening", "Night"], // Degrees
                    ["Morning", "Day", "Evening", "Night"], // Wind Direction
                    ["Morning", "Day", "Evening", "Night"], // Wind Speed
                    ["Morning", "Day", "Evening", "Night"]]; // Humidity

window.onload = function() { getLocation(); }
window.onresize = function(event) { fullScreen(); }

function fullScreen() {
  document.getElementById('device').style.height = ($(window).height() + 10) + 'px';
  document.getElementById('device').style.top = '-10px';
  document.getElementById('device').style.left = '-10px';
  document.getElementById('device').style.width = ($(window).width() + 10) + 'px';
}

function getWeatherData() {
  if(user_location.lat != undefined && user_location.lon != undefined) {
    $.ajax({
      url: 'https://api.openweathermap.org/data/2.5/forecast?lat=' + user_location.lat + '&lon=' + user_location.lon + '&units=metric&APPID=c43dc67f50678fa8deb7d820b8cc9f69',
      type: 'GET',
      dataType: 'jsonp',
      success: function(data) {
        weather_data[0][0] = data.list[3].weather[0].icon;
        weather_data[0][1] = data.list[4].weather[0].icon;
        weather_data[0][2] = data.list[5].weather[0].icon;
        weather_data[0][3] = data.list[6].weather[0].icon;

        weather_data[1][0] = data.list[3].weather[0].description;
        weather_data[1][1] = data.list[4].weather[0].description;
        weather_data[1][2] = data.list[5].weather[0].description;
        weather_data[1][3] = data.list[6].weather[0].description;

        weather_data[2][0] = data.list[3].main.temp;
        weather_data[2][1] = data.list[4].main.temp;
        weather_data[2][2] = data.list[5].main.temp;
        weather_data[2][3] = data.list[6].main.temp;

        weather_data[3][0] = getCardinal(data.list[3].wind.deg);
        weather_data[3][1] = getCardinal(data.list[4].wind.deg);
        weather_data[3][2] = getCardinal(data.list[5].wind.deg);
        weather_data[3][3] = getCardinal(data.list[6].wind.deg);

        weather_data[4][0] = data.list[3].wind.speed;
        weather_data[4][1] = data.list[4].wind.speed;
        weather_data[4][2] = data.list[5].wind.speed;
        weather_data[4][3] = data.list[6].wind.speed;

        weather_data[5][0] = data.list[3].main.humidity;
        weather_data[5][1] = data.list[4].main.humidity;
        weather_data[5][2] = data.list[5].main.humidity;
        weather_data[5][3] = data.list[6].main.humidity;

        insertDataIntoGUI()
      }
    });
  }
}

function getLocation() {
    if (navigator.geolocation) {
        var position = navigator.geolocation.getCurrentPosition(begin_reverse_geolocation);
    } else {
        console.log("Geolocation Not Supported");
        return undefined;
    }
}

function begin_reverse_geolocation(position) {
  var location = getReverseGeocodingData(position.coords.latitude, position.coords.longitude);
  user_location.lat = position.coords.latitude;
  user_location.lon = position.coords.longitude;
}

function getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            var address = (results[0].formatted_address);
            document.getElementById('header').innerHTML = address;
            getWeatherData();
            return address
        }
    });
}

function getCardinal(angle) {
    var directions = 8;

    var degree = 360 / directions;
    angle = angle + degree/2;

    if (angle >= 0 * degree && angle < 1 * degree)
        return "N";
    if (angle >= 1 * degree && angle < 2 * degree)
        return "NE";
    if (angle >= 2 * degree && angle < 3 * degree)
        return "E";
    if (angle >= 3 * degree && angle < 4 * degree)
        return "SE";
    if (angle >= 4 * degree && angle < 5 * degree)
        return "S";
    if (angle >= 5 * degree && angle < 6 * degree)
        return "SW";
    if (angle >= 6 * degree && angle < 7 * degree)
        return "W";
    if (angle >= 7 * degree && angle < 8 * degree)
        return "NW";

    return "N";
}

function insertDataIntoGUI() {
  document.getElementById('morning_icon').classList.add("wi-morning");
  document.getElementById('morning_icon').classList.add(translateWeatherIcon(weather_data[0][0]));
  document.getElementById('day_icon').classList.add("wi-day");
  document.getElementById('day_icon').classList.add(translateWeatherIcon(weather_data[0][1]));
  document.getElementById('evening_icon').classList.add("wi-evening");
  document.getElementById('evening_icon').classList.add(translateWeatherIcon(weather_data[0][2]));
  document.getElementById('night_icon').classList.add("wi-night");
  document.getElementById('night_icon').classList.add(translateWeatherIcon(weather_data[0][3]));

  document.getElementById('morning_degrees').innerHTML = weather_data[2][0];
  document.getElementById('day_degrees').innerHTML = weather_data[2][1];
  document.getElementById('evening_degrees').innerHTML = weather_data[2][2];
  document.getElementById('night_degrees').innerHTML = weather_data[2][3];

  document.getElementById('morning_type').innerHTML = weather_data[1][0];
  document.getElementById('day_type').innerHTML = weather_data[1][1];
  document.getElementById('evening_type').innerHTML = weather_data[1][2];
  document.getElementById('night_type').innerHTML = weather_data[1][3];

  document.getElementById('morning_wind').innerHTML = "Wind: " + weather_data[3][0] + " " + weather_data[4][0];
  document.getElementById('day_wind').innerHTML = "Wind: " + weather_data[3][1] + " " + weather_data[4][1];
  document.getElementById('evening_wind').innerHTML = "Wind: " + weather_data[3][2] + " " + weather_data[4][2];
  document.getElementById('night_wind').innerHTML ="Wind: " +  weather_data[3][3] + " " + weather_data[4][3];

  document.getElementById('morning_humidity').innerHTML = "Humidity: " + weather_data[5][0] + "%";
  document.getElementById('day_humidity').innerHTML = "Humidity: " + weather_data[5][1] + "%";
  document.getElementById('evening_humidity').innerHTML = "Humidity: " + weather_data[5][2] + "%";
  document.getElementById('night_humidity').innerHTML = "Humidity: " + weather_data[5][3] + "%";
}

function translateWeatherIcon(iconName) {
  if(iconName === "01d") {
    return "wi-day-sunny"
  } else if(iconName === "01n") {
    return "wi-night-clear"
  } else if(iconName === "02d") {
    return "wi-day-cloudy"
  } else if(iconName === "02n") {
    return "wi-night-alt-cloudy"
  } else if(iconName === "03d") {
    return "wi-cloudy"
  } else if(iconName === "03n") {
    return "wi-cloudy"
  } else if(iconName === "04d") {
    return "wi-cloudy-gusts"
  } else if(iconName === "04n") {
    return "wi-cloudy-gusts"
  } else if(iconName === "09d") {
    return "wi-day-rain-mix"
  } else if(iconName === "09n") {
    return "wi-night-alt-showers"
  } else if(iconName === "10d") {
    return "wi-day-rain"
  } else if(iconName === "10n") {
    return "wi-night-alt-rain-wind"
  } else if(iconName === "11d") {
    return "wi-day-sleet-storm"
  } else if(iconName === "11n") {
    return "wi-night-alt-sleet-storm"
  } else if(iconName === "13d") {
    return "wi-day_snow"
  } else if(iconName === "13n") {
    return "wi-night-alt-snow"
  } else if(iconName === "50d") {
    return "wi-windy"
  } else if(iconName === "50n") {
    return "wi-windy"
  }
}
