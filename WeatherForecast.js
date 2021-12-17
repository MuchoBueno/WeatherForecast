// Je prépare les variables qui seront utilisées dans les fonctions
let upperdiv = document.getElementById("upper-div")
let resultweather = document.getElementById("resultweather");
let result = document.getElementById("result");
let selector = document.querySelector('.dropdown');

let weekday = new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";

// Je prépare les fonctions qui seront appelées

function getCoord(cityCoord) {
	let myCoordURL = `https://api.opencagedata.com/geocode/v1/json?q=${cityCoord}&key=8ef3711d796147849544375725969ee4`
	let myCoordResult = fetch(myCoordURL)
		.then(response => response.json())
		.then(data => {
			let myLatitude = data.results[0].geometry.lat
			let myLongitude = data.results[0].geometry.lng
			return {myLatitude,myLongitude}
		})
		.catch(error => console.error(error))
	return myCoordResult		// retourne l'objet {myCoordResult.myLatitude,myCoordResult.myLongitude}
}

function getWeather(myLatitude, myLongitude) {
	let myWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${myLatitude}&lon=${myLongitude}&exclude=minutely,hourly,alerts&appid=590b99a875d7e07fc8cb750f558d8163`
	let myWeatherResult = fetch(myWeatherURL)
		.then(response => response.json())
		.then(data => {
			return data
		})
		.catch(error => console.error(error))
	return myWeatherResult	// retourne toutes les données obtenues par l'appel d'API dans le JSON
}

function getWeatherIcon(id) {
	if (id === 800) {
		return './assets/weathers/sun.svg';
	} else if (id >= 801 && 804 >= id) {
		if (id === 801 || id === 802) {
			return './assets/weathers/cloudy.svg';
		}
		if (id === 803 || id === 804) {
			return './assets/weathers/clouds.svg';
		}
	} else if (id >= 600 && 622 >= id) {
		return './assets/weathers/snow.svg';
	} else {
		return './assets/weathers/rain.svg';
	}
}

function checkNightMode() {
	if (myWeatherResult.current.weather[0].icon.includes("n")) {
		console.log("night icon detected")
		upperdiv.insertAdjacentHTML('afterstart', `<div class="night-mode" id="night-mode"`)
		upperdiv.insertAdjacentHTML('afterstart', `</div>`)
	}
}

function deleteChild() {
	while (resultweather.firstChild) {
		resultweather.removeChild(resultweather.firstChild);
	}
}

// Lorsque la page est entièrement chargée et que le bouton "Get weather !" est cliqué :

document.addEventListener("DOMContentLoaded", function () {
	document.querySelector("button").addEventListener("click", function() {
		// click.preventDefault()
		let userInput = document.getElementById('form-user').value;
		deleteChild()
		getCoord(userInput)
			.then((myCoordResult) => {		
				getWeather(myCoordResult.myLatitude, myCoordResult.myLongitude)
					.then(myWeatherResult => {
						// checkNightMode();
						for (let i = 0; i <= selector.value; i++) {
							let dayNumber = new Date(myWeatherResult.daily[i].dt * 1000).getDay()
							let day = weekday[dayNumber]
							resultweather.insertAdjacentHTML('beforeend', `<div class="result"><h2>${day}</h2><div class="image"><img class=weather-icon src=${getWeatherIcon(myWeatherResult.daily[i].weather[0].id)}></img></div></div>`)
						}

					})
    	    })
	})
})

// TODO :
// night mode
// mettre l'info en cache pour limiter le nombre d'appels à l'API