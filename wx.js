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
	let data = await fetch(url, {
		mode: 'cors',
	});
	/* Debug logic, just in case I break fetching again. */
	console.log('Station data fetched for ' + name);
	return await data.json();
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
	let report = document.createElement("p");
	report.innerHTML = 'Temperature: ' + Math.round(cToF(props.temperature.value)) + '°F\n<br />';

	report.innerHTML += 'Humidity: ' + Math.round(props.relativeHumidity.value) + '%\n<br />';

        let dirs = ["N", "NNE", "NE", "ENE", "E", "ESE",
            "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

	let windSpd = Math.round(kphToMph(props.windSpeed.value)) + ' mph';
	if (!(props.windDirection.value === null))
	{
		let heading = Math.round((props.windDirection.value + 11.25) / 22.5);
		console.log(heading);
		report.innerHTML += 'Wind: ' + dirs[heading % 16] + ' '
			+ windSpd;
	}
	else if (props.windSpeed.value != 0)
	{
		report.innerHTML += 'Wind: Vbr ' + windSpd;
	}
	else
	{
		report.innerHTML += 'Wind: ' + windSpd;
	}

	box.appendChild(report);
}

function cToF(celsius)
{
	return celsius * (9.0 / 5.0) + 32;
}

function kphToMph(kph)
{
	return kph * 0.621;
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
