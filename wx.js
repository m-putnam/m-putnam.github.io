'use strict';

window.onload = async function()
{
	var stationInfo = await getStation('KEEN');
	populateWeather(stationInfo);
};

/* Retrieve and return asynchronously the JSON data of the latest
 * observation from the given station. */
async function getStation(name)
{
	let url = 'https://api.weather.gov/stations/' + name + '/observations/latest';
	/* No stale observations */
	let data = await fetch(url, {
		mode: 'cors',
		cache: 'no-cache',
	});
	/* Debug logic, just in case I break fetching again. */
	console.log('Station data fetched for ' + name);
	return await data.json();
}

function makeRow(table, heading, content)
{
	let tableRow = document.createElement("tr");
	let rowHeading = document.createElement("td");
	rowHeading.id = 'right';
	let rowHeadingLabel = document.createElement("b");
	rowHeadingLabel.innerText = heading;
	rowHeading.appendChild(rowHeadingLabel);
	let rowContent = document.createElement("td");
	rowContent.innerText = content;
	tableRow.appendChild(rowHeading);
	tableRow.appendChild(rowContent);
	table.appendChild(tableRow);
}

/* Populate the on-page weather information box with data */
function populateWeather(info)
{
	let props = info.properties;
	let box = document.getElementById('weather');
	/* The "header" label is special, since we want it on the
	 * initial page load to avoid an empty box while the script
	 * works.  All other elements are dynamic. */
	let hdr = document.getElementById('wxheader');
	let observationStamp = new Date(props.timestamp);
	/* TODO Pull location name from station info, requires passing a
	 * second JSON object from calling function, additional
	 * retrieval function. */
	hdr.innerText = 'Conditions in Keene, NH circa ' + fmtClockTime(observationStamp) + ': '
		+ props.textDescription;

	let wxTable = document.getElementById('wxtable');
	let tempLabel = Math.round(cToF(props.temperature.value)) + '°F';
	makeRow(wxTable, 'Temperature', tempLabel);

	let humidityLabel = Math.round(props.relativeHumidity.value) + '%';
	makeRow(wxTable, 'Humidity', humidityLabel);

        let dirs = ["N", "NNE", "NE", "ENE", "E", "ESE",
            "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

	let windLabel = '';
	let windSpd = Math.round(kphToMph(props.windSpeed.value)) + ' mph';
	if (props.windDirection.value !== null) {
		let heading = Math.round((props.windDirection.value + 11.25) / 22.5);
		console.log(heading);
		windLabel = dirs[heading % 16] + ' ' + windSpd;
	} else if (props.windSpeed.value != 0) {
		windLabel = 'Vrbl ' + windSpd;
	} else {
		windLabel = windSpd;
	}
	makeRow(wxTable, 'Wind Speed', windLabel);

	let pressureLabel = '';
	if (props.seaLevelPressure.value !== null) {
		mbar = props.seaLevelPressure.value * 0.01;
		pressureLabel = mbarToInHg(mbar).toFixed(2) + ' in ('
			+ mbar.toFixed(1) + ' mb)';
	} else {
		pressureLabel = 'NA';
	}
	makeRow(wxTable, 'Barometer', pressureLabel);
}

function cToF(celsius)
{
	return celsius * (9.0 / 5.0) + 32;
}

function kphToMph(kph)
{
	return kph * 0.621;
}

function mbarToInHg(mbar)
{
	return mbar * 0.02953;
}

/* Format a timestamp in twelve-hour time.  If hours are greater than
 * twelve, format as PM. */
function fmtClockTime(stamp)
{
	let str = stamp.getHours() % 12 + ':';
	if (!(stamp.getMinutes() % 10))
		str += '0';

	str += stamp.getMinutes() + ' ';
	str += (stamp.getHours() % 12) ? 'PM' : 'AM';
	return str;
}
