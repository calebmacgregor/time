import { keyValidation } from "./apiCallFunctions.js"
import { pingURL } from "./endpoints.js"
import {
	handleNavPanel,
	handleLogout,
	handleRefresh,
	styleNavLinks
} from "./utilities.js"
import { setPreferences } from "./utilities.js"

const payInput = document.querySelector(".dollars-input")
const timeInput = document.querySelector(".time-input")
const expenseInput = document.querySelector(".expense-input")
const keyInput = document.querySelector(".api-key-input")

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

styleNavLinks()

//Open nav panel functionality
document.addEventListener("click", handleNavPanel)

//Logout functionality
document.addEventListener("click", handleLogout)

//Refresh functionality
document.addEventListener("click", handleRefresh)

//Set preferences on submit
document.addEventListener("click", setPreferences)
