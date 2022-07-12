window.onload = function()
{
	getStation('KEEN');
	console.log('foo');
};

async function getStation(name)
{
	var url = 'https://api.weather.gov/stations/KEEN/observations/latest';
	var data = await fetch(url, {
		mode: 'cors'
	});
	console.log('fetched');
}
