import { getTime, timeValue } from "./calculators.js"
import { keyValidation } from "./apiCallFunctions.js"
import { Preferences } from "./classes.js"
import { pingURL } from "./endpoints.js"
import {
	handleNavPanel,
	handleLogout,
	handleRefresh,
	styleNavLinks
} from "./utilities.js"

const submit = document.querySelector(".submit")
const payInput = document.querySelector(".dollars-input")
const timeInput = document.querySelector(".time-input")
const keyInput = document.querySelector(".api-key-input")
const timeError = document.querySelector(".time-error")
const dollarsError = document.querySelector(".dollars-error")
const apiError = document.querySelector(".api-error")

//Redirect if the key in storage is bad
let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))
if (!preferences) {
	window.location.replace("./onboarding.html")
} else if (preferences) {
	let result = await keyValidation(pingURL, preferences.apiKey)
	if (result.ok == false) {
		window.location.replace("./onboarding.html")
	}
}

//Set the input values using data from the preferences object
payInput.value = preferences.afterTaxPay
timeInput.value = preferences.hoursWorked
keyInput.value = preferences.apiKey

styleNavLinks()

//Open nav panel functionality
document.addEventListener("click", handleNavPanel)

//Logout functionality
document.addEventListener("click", handleLogout)

//Refresh functionality
document.addEventListener("click", handleRefresh)

submit.addEventListener("click", (e) => {
	e.preventDefault()

	//Reset the error messages
	dollarsError.style.display = "none"
	timeError.style.display = "none"
	apiError.style.display = "none"
	const pay = parseInt(payInput.value)
	const time = parseInt(timeInput.value)
	const apiKey = keyInput.value
	const response = keyValidation(pingURL, apiKey)

	//Check whether numbers are valid
	const validPay = isNaN(pay) ? false : true
	const validTime = isNaN(time) ? false : true
	let validKey

	response.then((data) => {
		//Set the validity of the validKey
		//Use this below for error message population
		if (data.ok) {
			validKey = true
		} else {
			validKey = false
		}
		if (data.ok == true && validPay && validTime) {
			console.log("Valid key")

			//Construct the preferences object
			let newPreferences = new Preferences(
				apiKey,
				true,
				pay,
				time,
				getTime(pay, time)
			)

			//Put the preferences object into localstorage
			localStorage.setItem("TIME-preferences", JSON.stringify(newPreferences))

			//Redirect to the main page
			window.location.replace("./")
		} else {
			if (!validPay) {
				dollarsError.style.display = "block"
			}
			if (!validTime) {
				timeError.style.display = "block"
			}
			if (!validKey) {
				apiError.style.display = "block"
			}
		}
	})
})
