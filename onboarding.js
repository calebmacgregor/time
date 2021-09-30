import { keyValidation } from "./apiCallFunctions.js"
import { pingURL } from "./endpoints.js"
import { setPreferences } from "./utilities.js"

//Redirect if the key in storage is valid
let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))
if (preferences) {
	let result = await keyValidation(pingURL, preferences.apiKey)
	if (result.ok == true) {
		window.location.replace("./")
	}
}

document.addEventListener("click", setPreferences)
