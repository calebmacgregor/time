import { keyValidation } from "./apiCallFunctions.js"
import { pingURL } from "./endpoints.js"
import { setPreferences, selectInputOnClick } from "./utilities.js"

const payInput = document.querySelector(".dollars-input")
const timeInput = document.querySelector(".time-input")
const expenseInput = document.querySelector(".expense-input")
const keyInput = document.querySelector(".api-key-input")
const survivalSavingsInput = document.querySelector(".survival-savings-input")

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
expenseInput.value = preferences.expenses
keyInput.value = preferences.apiKey
survivalSavingsInput.checked = preferences.survivalSavingsMode

//Set preferences on submit
document.addEventListener("click", setPreferences)

//Select all when clicking an input
document.addEventListener("click", selectInputOnClick)
