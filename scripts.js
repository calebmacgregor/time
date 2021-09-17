import { getTime, timeValue } from "./calculators.js"
import { renderTransactions, renderBalance } from "./render.js"
import {
	pingUp,
	getTransactionAccounts,
	getSaverAccounts,
	getAccounts,
	keyValidation
} from "./apiCallFunctions.js"
import { timeTransaction } from "./classes.js"

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL =
	"https://api.up.com.au/api/v1/transactions?page[size]=50"

let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))

const rateObject = preferences.rateObject

let result = await keyValidation(pingURL, preferences.apiKey)
if (result.ok == false) {
	console.log("redirecting")
	window.location.replace("./onboarding.html")
}

let nextPage

//Initial pageload transactions
renderBalance(getBalance(accountsURL, preferences.apiKey, rateObject))
renderTransactions(
	getTransactions(transactionsURL, preferences.apiKey, timeValue),
	preferences
)

//Get transactions from Up and run them through
//the timevalue function
export async function getTransactions(url, token) {
	let data = await pingUp(url, token)
	nextPage = await data.links.next
	let output = await data.data.map((item) => {
		return new timeTransaction(item, rateObject, timeValue)
	})
	return output
}

async function getBalance(accountsURL, token, rateObject) {
	const transactionAccount = await getTransactionAccounts(accountsURL, token)
	const transactionBalance = await transactionAccount.reduce((total, item) => {
		return total + parseFloat(item.attributes.balance.value)
	}, 0)

	const accounts = await getAccounts(accountsURL, token)
	const accountsBalance = await accounts.reduce((total, item) => {
		return total + parseFloat(item.attributes.balance.value)
	}, 0)

	const savingsAccounts = await getAccounts(accountsURL, token)
	const savingsBalance = await savingsAccounts.reduce((total, item) => {
		return total + parseFloat(item.attributes.balance.value)
	}, 0)

	const balanceTimeValue = timeValue(accountsBalance, rateObject)
	const transactionBalanceTimeValue = timeValue(transactionBalance, rateObject)
	return {
		balanceTimeValue: balanceTimeValue,
		transactionBalanceTimeValue: transactionBalanceTimeValue
	}
}

//Infinite scrolling logic
function infiniteScroll() {
	let scrollLocation = window.innerHeight + window.pageYOffset
	let scrollHeight = document.body.scrollHeight

	if (scrollLocation === scrollHeight) {
		if (!nextPage) {
			console.log("no next page")
		} else {
			renderTransactions(
				getTransactions(nextPage, preferences.apiKey, timeValue),
				preferences
			)
		}
	}
}

document.addEventListener("scroll", () => {
	infiniteScroll()
})

//Toggle between transactional and total views for balance
document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("balance")) return
	e.target.classList.toggle("total")
	renderBalance(getBalance(accountsURL, preferences.apiKey, rateObject))
})

//Fade and scale down the balance on scroll
document.addEventListener("scroll", (e) => {
	const balanceContainer = document.querySelector(".balance-container")
	const balanceContainerHeight = balanceContainer.offsetHeight
	let scrollLocation = window.pageYOffset

	let percentVisibile = 1 - (scrollLocation * 1.5) / balanceContainerHeight

	percentVisibile > 0
		? (balanceContainer.style.opacity = percentVisibile)
		: (balanceContainer.style.opacity = 0)
})

//Switches transactions between dollar and time views (time is default)
document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("transaction-related")) return
	const transaction = e.target.closest(".transaction")

	const timeSpent = transaction.querySelector(".time-spent")
	const moneySpent = transaction.querySelector(".money-spent")

	timeSpent.classList.toggle("hidden")
	moneySpent.classList.toggle("hidden")
})

//Handle calculating a time value on demand
const estimateInput = document.querySelector(".estimate-input")
const estimateResult = document.querySelector(".estimate-result")

estimateInput.addEventListener("input", () => {
	if (!isNaN(estimateInput.value)) {
		const timeValueObject = timeValue(
			estimateInput.value,
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

		estimateResult.innerText = timeValueString
	}
})

//Show modal when button is clicked
const estimateContainer = document.querySelector(".estimate-container")
const closeButton = document.querySelector(".close-button")

closeButton.addEventListener("click", () => {
	if (estimateContainer.classList.contains("hidden")) {
		closeButton.classList.remove("maximise")
		estimateContainer.style.display = "flex"
		setTimeout(() => {
			estimateContainer.classList.remove("hidden")
		}, 5)
	} else {
		closeButton.classList.add("maximise")
		estimateContainer.classList.toggle("hidden")
		setTimeout(() => {
			estimateContainer.style.display = "none"
		}, 251)
	}
})

//Logout functionality
const logout = document.querySelector(".logout")

logout.addEventListener("click", (e) => {
	localStorage.removeItem("TIME-preferences")
	preferences = ""
	location.reload()
})
