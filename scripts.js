import { getTime, timeValue } from "./calculators.js"
import { renderTransactions } from "./render.js"
import {
	pingUp,
	getTransactionAccounts,
	getSaverAccounts,
	getAccounts
} from "./apiCallFunctions.js"

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL =
	"https://api.up.com.au/api/v1/transactions?page[size]=50"

const rateObject = getTime(2880, 80)

//Set a global preferences object
//TODO: set this to be retrieved from localstorage
// const preferences = {
// 	hideTransfers: true,
// 	apiKey:
// 		"up:yeah:NULvDQe7lrgiG9eMgnbP62XrsuUUw2LDkQjN4J3hvFM5w0uTUQnBXtAT8pyjXu6hHk8cduezjrccrgKdRPutlTOX35qdlGJwXZsZCHGYQnAURAbhYSd15buR6v6eAWQr"
// }

// localStorage.setItem("preferences", JSON.stringify(preferences))

if (!localStorage.getItem("preferences")) {
	window.location.replace("http://localhost:5500/onboarding.html")
}

let preferences = JSON.parse(localStorage.getItem("preferences"))

let nextPage
let transactionArray = []

//Initial pageload transactions
populateBalance(getBalance(accountsURL, preferences.apiKey, rateObject))
renderTransactions(
	getTransactions(transactionsURL, preferences.apiKey),
	preferences
)

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

async function populateBalance(balanceTimeValue) {
	const balanceElement = document.querySelector(".balance")
	const balanceIndicatorText = document.querySelector(".balance-indicator-text")
	const balanceObject = await balanceTimeValue
	let chosenObject

	if (balanceElement.classList.contains("total")) {
		balanceIndicatorText.innerText = "Total balance"
		chosenObject = balanceObject.balanceTimeValue
	} else {
		balanceIndicatorText.innerText = "Spending balance"
		chosenObject = balanceObject.transactionBalanceTimeValue
	}

	const balanceString = `${
		chosenObject.hoursPortion < 10
			? "0" + chosenObject.hoursPortion
			: chosenObject.hoursPortion
	}h:${
		chosenObject.minutesPortion < 10
			? "0" + chosenObject.minutesPortion
			: chosenObject.minutesPortion
	}m`

	//Apply balanceString to the balance
	balanceElement.innerHTML = balanceString
}

//Get transactions from Up and run them through
//the timevalue function
async function getTransactions(url, token) {
	console.log("getting transactions")
	let data = await pingUp(url, token)
	nextPage = await data.links.next
	transactionArray = transactionArray.concat(data.data)
	let output = await data.data.map((item) => {
		//Create an empty object
		let obj = {}
		//Populate that object with the data I need for renderTransactions
		obj.timeValueObject = timeValue(
			Math.abs(item.attributes.amount.value),
			rateObject
		)

		let transactionType

		if (item.relationships.transferAccount.data) {
			transactionType = "Transfer"
		} else {
			transactionType = "Expense"
		}

		obj.id = item.id
		obj.attributes = item.attributes
		obj.transactionType = transactionType
		obj.other = item

		return obj
	})

	return output
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
				getTransactions(nextPage, preferences.apiKey),
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
	populateBalance(getBalance(accountsURL, preferences.apiKey, rateObject))
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

//GARBAGE CODE
//Spins the button
const simulate = document.querySelector(".simulate")

simulate.addEventListener("click", (e) => {
	simulate.classList.toggle("open")
	const transcations = Array.from(
		document.querySelectorAll(".transaction.transfer")
	)
	transcations.forEach((item) => {
		item.classList.toggle("hidden")
		let itemHeight = item.offsetHeight
	})
})
