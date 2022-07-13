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
