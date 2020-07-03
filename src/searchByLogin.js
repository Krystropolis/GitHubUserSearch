export default function search(username) {
	let request = new XMLHttpRequest();
	request.open(
		'GET',
		'https://api.github.com/search/users?q=' + username + '+in:login',
	);
	request.send();
	request.onload = () => {
		console.log(request);
		if (request.status === 200) {
			console.log(JSON.parse(request.response));
			return request.response;
		} else {
			console.log(`error ${request.status} ${request.statusText}`);
			return false;
		}
	};
}
