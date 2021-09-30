import { timeValue } from "./calculators.js"
import { renderTransactions, renderBalance } from "./render.js"
import {
	pingUp,
	getTransactionAccounts,
	keyValidation
} from "./apiCallFunctions.js"
import {
	handleNavPanel,
	handleCalculatorPanel,
	fadeBalance,
	disableScroll,
	handleLogout,
	handleRefresh,
	styleNavLinks,
	toggleCurrency
} from "./utilities.js"
import { timeTransaction } from "./classes.js"
import { pingURL, accountsURL, transactionsURL } from "./endpoints.js"

///// Global variables /////
let nextPage
let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))
const pingLock = { locked: false }

///// Redirect to onboarding if key is bad /////
if (!preferences) {
	window.location.replace("./onboarding.html")
} else if (preferences) {
	let result = await keyValidation(pingURL, preferences.apiKey)
	if (result.ok == false) {
		window.location.replace("./onboarding.html")
	}
}

///// Load initial page elements /////
renderBalance(
	getBalance(accountsURL, preferences.apiKey, preferences.rateObject)
)

renderTransactions(
	getTransactions(transactionsURL, preferences.apiKey, timeValue),
	preferences
)

styleNavLinks()

///// Event listeners /////

//Toggle between currencies (time or dollars)
document.addEventListener("click", toggleCurrency)

//Check whether we need to grab more transactions
document.addEventListener("touchend", infiniteScroll)

//Fade and scale down the balance on scroll
document.addEventListener("scroll", fadeBalance)

//Open nav panel functionality
document.addEventListener("click", handleNavPanel)

//Logout functionality
document.addEventListener("click", handleLogout)

//Refresh functionality
document.addEventListener("click", handleRefresh)

//Open calculator panel
document.addEventListener("click", handleCalculatorPanel)

//Handle calculating a time value on demand
document.addEventListener("input", handleCalculator)

//Disable scroll when panels are open
document.addEventListener("touchmove", disableScroll, { passive: false })

///// Functions that can't live in modules /////
function handleCalculator(e) {
	//Check whether the clicked item is related to calculator input
	const calculatorInput = e.target.closest(".calculator-input")
	//If it's not, bail
	if (!calculatorInput) return
	//If it is, grab the calculator-result as well
	const calculatorResult = document.querySelector(".calculator-result")
	//Make sure it's a real number
	if (!isNaN(calculatorInput.value)) {
		const timeValueObject = timeValue(
			calculatorInput.value,
			preferences.rateObject
		)

		const timeValueString = `${
			timeValueObject.hoursPortion < 10
				? "0" + timeValueObject.hoursPortion
				: timeValueObject.hoursPortion
		}h:${
			timeValueObject.minutesPortion < 10
				? "0" + timeValueObject.minutesPortion
				: timeValueObject.minutesPortion
		}m`

		calculatorResult.innerText = timeValueString
	}
}

//Infinite scrolling logic
function infiniteScroll() {
	let scrollLocation = window.innerHeight + window.pageYOffset
	let scrollHeight = document.body.scrollHeight

	if (scrollLocation / scrollHeight > 0.9) {
		if (!nextPage) {
		} else {
			renderTransactions(
				getTransactions(nextPage, preferences.apiKey, timeValue),
				preferences
			)
		}
	}
}

//Get transactions from Up and run them through
//the timevalue function
async function getTransactions(url, token) {
	if (pingLock.locked == true) return
	pingLock.locked = true
	let loader = document.querySelector(".loading")
	loader.classList.remove("inactive")
	let data = await pingUp(url, token)
	nextPage = await data.links.next
	let output = await data.data.map((item) => {
		return new timeTransaction(item, preferences.rateObject, timeValue)
	})
	loader.classList.add("inactive")
	pingLock.locked = false
	return output
}

async function getBalance(accountsURL, token, rateObject) {
	if (pingLock.locked == true) return
	const transactionAccount = await getTransactionAccounts(accountsURL, token)
	const transactionBalance = await transactionAccount.reduce((total, item) => {
		return total + parseFloat(item.attributes.balance.value)
	}, 0)

	const transactionBalanceTimeValue = timeValue(transactionBalance, rateObject)

	return {
		transactionBalanceDollarValue: transactionBalance,
		transactionBalanceTimeValue: transactionBalanceTimeValue
	}
}
