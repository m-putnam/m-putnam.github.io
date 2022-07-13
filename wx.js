window.onload = async function()
{
	var stationInfo = await getStation('KEEN');
	console.log('foo');
	populateWeather(stationInfo);
};

async function getStation(name)
{
	let url = 'https://api.weather.gov/stations/KEEN/observations/latest';
	let data = await fetch(url, {
		mode: 'cors',
	});
	console.log('fetched');
	return await data.json();
}

function populateWeather(info)
{
	let props = info.properties;
	let box = document.getElementById('weather');
	let hdr = document.getElementById('wxheader');
	let observationStamp = new Date(props.timestamp);
	hdr.innerText = 'Conditions in Keene, NH circa ' + fmtClockTime(observationStamp) + ': '
		+ props.textDescription;
	let report = document.createElement("p");
}

/* Format a timestamp in twelve-hour time */
function fmtClockTime(stamp)
{
	let str = stamp.getHours() % 12 + ':';
	if (!(stamp.getMinutes() % 10))
		str += '0';

	str += stamp.getMinutes() + ' ';
	str += (stamp.getHours() % 12) ? 'PM' : 'AM';
	return str;
}
