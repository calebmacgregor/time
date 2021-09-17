import { getTime } from "./calculators.js"
import { keyValidation } from "./apiCallFunctions.js"

const submit = document.querySelector(".submit")
const keyInput = document.querySelector(".api-key-input")
const payInput = document.querySelector(".dollars-input")
const timeInput = document.querySelector(".time-input")

const timeError = document.querySelector(".time-error")
const dollarsError = document.querySelector(".dollars-error")
const apiError = document.querySelector(".api-error")

submit.addEventListener("click", (e) => {
	e.preventDefault()

	//Reset the error messages
	dollarsError.style.display = "none"
	timeError.style.display = "none"
	apiError.style.display = "none"
	const pay = parseInt(payInput.value)
	const time = parseInt(timeInput.value)
	const apiKey = keyInput.value
	const response = keyValidation(
		"https://api.up.com.au/api/v1/util/ping",
		apiKey
	)

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
			let preferences = {}

			preferences.rateObject = getTime(pay, time)
			preferences.hideTransfers = true
			preferences.apiKey = apiKey
			//Put the preferences object into localstorage
			localStorage.setItem("TIME-preferences", JSON.stringify(preferences))

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
