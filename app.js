const baseURL ="https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey ="&appid=4d33f964fdad04b3f83ea7b5c71ebaf2&units=metric";




let searchCity = document.querySelector("#inpt");
let searchBtn = document.querySelector("#btn");
let cityName = document.querySelector("#city-name");
let cityTemp = document.querySelector("#temp");
let weatherStatus = document.querySelector("#weather-status");
let weatherIcon = document.querySelector(".weather-icon");
let feelsLike = document.querySelector("#feels-like");
let showDate = document.querySelector("#date");
let showTime = document.querySelector("#time");
let showHumidity = document.querySelector("#humidity");
let showWind = document.querySelector("#wind");
let showpressure = document.querySelector("#pressure");
let showVisibility= document.querySelector("#visibility");
let forcasts = document.querySelectorAll(".forecast-card");







//Api call on search button press
let city="";
searchBtn.addEventListener("click",()=>{
city=searchCity.value;
 apicall();
});
async function apicall(){

    let response = await fetch(baseURL+city+apiKey);
    let data = await response.json();

    console.log(data);
    changeCityName(data.city.name);
    changeCitytemp(data.list[0].main.temp);
    changeWeatherStatus(data.list[0].weather[0].main);
    changeFeelsLike(data.list[0].main.feels_like);
    changeDateAndTime();
    changeHumidity(data.list[0].main.humidity);
    changeWindSpeed(data.list[0].wind.speed);
    changePressure(data.list[0].main.pressure);
    changeVis(data.list[0].visibility);

    // changing forcasts 
   // Get one forecast for each day (12:00 PM forecast)
const dailyForecast = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
);

for (let i = 0; i < forcasts.length && i < dailyForecast.length; i++) {

    // Current day's forecast
    const forecast = dailyForecast[i];

    // Get elements inside the current forecast card
    const day = forcasts[i].querySelector("p");
    const img = forcasts[i].querySelector("img");
    const temp = forcasts[i].querySelector("h4");

    // Convert date into weekday name
    const date = new Date(forecast.dt_txt);
    day.innerText = date.toLocaleDateString("en-US", {
        weekday: "short"
    });

    // Temperature
    temp.innerText = `${Math.round(forecast.main.temp)}°C`;

    // Weather icon
    const icon = forecast.weather[0].icon;
    img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
    
    

}



    
    
    
    
    



//city name
function changeCityName(name){

    cityName.innerText = name;

}

function changeCitytemp(temp){

    Math.round(temp)
    cityTemp.innerText=Math.round(temp)+"°C";
}
function changeWeatherStatus(weather){
    weatherStatus.innerText=weather;
    changeWeatherImg(weather);
}
function changeWeatherImg(weather) {

    weatherIcon.src=`./images/${weather}.png`;
    
}
function changeFeelsLike(temp) {

    feelsLike.innerText=Math.round(temp)+"°C";
    
}
function changeDateAndTime(){

    let now = new Date ;


showDate.innerText = now.toLocaleDateString();
showTime.innerText = now.toLocaleTimeString();

}
function changeHumidity(hum){

    showHumidity.innerText=hum+"%";

}
function changeWindSpeed(speed) {
    
    showWind.innerText=Math.floor((speed/1000)*3600)+" Km/h";
}
function changePressure(press){

    showpressure.innerText=press+"hPa";

}
function changeVis(vis) {

    showVisibility.innerText=vis/1000 +"km";
    
}