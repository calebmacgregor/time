//Redirect if the key in storage is valid
export async function redirectIfValid(keyValidation) {
	const pingURL = "https://api.up.com.au/api/v1/util/ping"
	let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))
	if (preferences) {
		let result = await keyValidation(pingURL, preferences.apiKey)
		if (result.ok == true) {
			console.log("redirecting")
			window.location.replace("./")
		}
	}
}
