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
	let p = document.createElement('p');
	let observationStamp = new Date(props.timestamp);
	p.innerText = 'Conditions in Keene, NH circa ' + fmtClockTime(observationStamp);
	box.appendChild(p);
}

function fmtClockTime(stamp)
{
	let str = stamp.getHours() % 12 + ':';
	if (!(stamp.getMinutes() % 10))
		str += '0';

	str += stamp.getMinutes() + ' ';
	if (stamp.getHours() % 12)
		str += 'PM';
	else
		str += 'AM';
	return str;
}
