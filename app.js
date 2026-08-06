const baseURL ="https://api.openweathermap.org/data/2.5/forecast?";
const apiKey ="appid=4d33f964fdad04b3f83ea7b5c71ebaf2&units=metric";




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
let toggleBtns = document.querySelectorAll(".toggle span");
let temps = document.querySelectorAll(".convert-temp");
let locationBtn = document.querySelector(".location-btn");
let errClass = document.querySelector("#err");
let loadClass = document.querySelector("#load");

let turnC = false;//curr location or by city name
// press enter to search
searchCity.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        city = searchCity.value;
        turnC = true;

        apicall();

    }

});
let lat ,long;


locationBtn.addEventListener("click", async () => {

    turnC = false;

    showLoading();

    navigator.geolocation.getCurrentPosition(
        (currLoc) => {

            lat = currLoc.coords.latitude;
            long = currLoc.coords.longitude;

            console.log(lat, long);

            apicall();

        },
        (error) => {

            hideLoading();

            if(error.code === 1){
                showError("Location permission denied");
            }
            else if(error.code === 2){
                showError("Location unavailable");
            }
            else if(error.code === 3){
                showError("Location request timed out");
            }
            else{
                showError("Unable to get location");
            }

        }
    );

});



toggleBtns.forEach(btn => {

    btn.addEventListener("click",()=>{

        console.log();
        if(btn.innerText ==="°C"){
            changeToC();
            btn.setAttribute("class","active");
            document.querySelector("#deg-f").removeAttribute("class");
        }
        else {
            changeToF();
             btn.setAttribute("class","active");
            document.querySelector("#deg-c").removeAttribute("class");

        }


    });
    
});

function changeToC(){
  
    temps.forEach(temp => {

       let fahrenheit= parseInt(temp.innerText);

       temp.innerText=Math.round((fahrenheit - 32) * 5 / 9) +"°C";
    
    });
}
function changeToF(){

    temps.forEach(temp => {

       let celsius= parseInt(temp.innerText);

       temp.innerText=Math.round((celsius * 9 / 5) + 32) + "°F";
        
    });
}


//Api call on search button press
let city="";

searchBtn.addEventListener("click",()=>{
city=searchCity.value;
turnC=true;
 apicall();
});


function showLoading(){
   
    loadClass.setAttribute("class","showing");

}

function hideLoading(){
    loadClass.setAttribute("class","loading");
    
}
function showError(message){

  errClass.setAttribute("class","showing");

  document.querySelector("#err p").innerText=message;

}


async function apicall(){

    try {

        showLoading();

        let response;

        if(turnC){
            response = await fetch(baseURL+"q="+city+"&"+apiKey);
        }
        else{
            response = await fetch(baseURL+"lat="+lat+"&lon="+long+"&"+apiKey);
        }

        let data = await response.json();

        // API error handling
        if(data.cod !== "200"){
            showError(data.message || "Something went wrong");
            return;
        }

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


        // changing forecasts 
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
    catch(error){

        console.log(error);
        showError("Unable to fetch weather data");

    }
    finally{

        hideLoading();

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