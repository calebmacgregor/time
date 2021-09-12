import { getTime, timeValue } from "./calculators.js"
import {
	pingUp,
	getTransactionAccounts,
	getSaverAccounts,
	getAccounts
} from "./apiCallFunctions.js"
import { createTransactionElement } from "./createElements.js"

const token =
	"up:yeah:NULvDQe7lrgiG9eMgnbP62XrsuUUw2LDkQjN4J3hvFM5w0uTUQnBXtAT8pyjXu6hHk8cduezjrccrgKdRPutlTOX35qdlGJwXZsZCHGYQnAURAbhYSd15buR6v6eAWQr"

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL = "https://api.up.com.au/api/v1/transactions"

const list = document.querySelector(".list")

const rateObject = getTime(2880, 80)

let nextPage
let previousPage
// let transactionArray = []

populateBalance(getBalance(accountsURL, token, rateObject))
populateTransactions(transactionsURL, token)

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

//Construct and populate each transaction from the API call
async function populateTransactions(url, token) {
	let data = await pingUp(url, token)
	nextPage = await data.links.next
	previousPage = await data.links.prev

	await data.data.forEach((item) => {
		//Get the timeValue of each transaction
		let timeValueObject = timeValue(
			Math.abs(item.attributes.amount.value),
			rateObject
		)

		//Convert the settledTime value to a date
		const settledTime = item.attributes.settledAt
			? new Date(item.attributes.settledAt)
			: new Date(item.attributes.createdAt)

		//Create the transaction element
		let elt = createTransactionElement(
			timeValueObject,
			item.attributes.description,
			`${settledTime.toLocaleString("en-AU", {
				month: "short",
				day: "numeric"
			})}, ${settledTime.toLocaleTimeString("en-AU", {
				timeStyle: "short"
			})}`
		)

		//Append the transaction element to List
		list.appendChild(elt)
	})
}

//Infinite scrolling logic
function infiniteScroll() {
	let scrollLocation = window.innerHeight + window.pageYOffset
	let scrollHeight = document.body.scrollHeight

	if (scrollLocation === scrollHeight) {
		if (!nextPage) {
			console.log("no next page")
		} else {
			populateTransactions(nextPage, token)
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
	populateBalance(getBalance(accountsURL, token, rateObject))
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

document.addEventListener("click", (e) => {
	if (!e.target.classList.contains("transaction-value")) return
	const timeSpent = document.querySelector(".time-spent")
	const moneySpent = document.querySelector(".money-spent")

	timeSpent.classList.toggle("hidden")
	moneySpent.classList.toggle("hidden")
})
