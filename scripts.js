import { getTime, timeCost } from "./calculators.js"
import { pingUp, getTransactionAccounts, getSaverAccounts } from "./accounts.js"

const token =
	"up:yeah:NULvDQe7lrgiG9eMgnbP62XrsuUUw2LDkQjN4J3hvFM5w0uTUQnBXtAT8pyjXu6hHk8cduezjrccrgKdRPutlTOX35qdlGJwXZsZCHGYQnAURAbhYSd15buR6v6eAWQr"

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL = "https://api.up.com.au/api/v1/transactions"

const content = document.querySelector("#content")
const nextButton = document.querySelector("#next")
const previousButton = document.querySelector("#previous")

const rateObject = getTime(2880, 80)
const amountObject = timeCost(5.5, rateObject)

let nextPage
let previousPage

async function getTransactions(url, token) {
	let data = await pingUp(url, token)
	nextPage = await data.links.next
	previousPage = await data.links.prev

	data.data.forEach((transaction) => {
		let timeCostVariable = timeCost(
			Math.abs(transaction.attributes.amount.value),
			rateObject
		)
		let datetime = new Date(Date.parse(transaction.attributes.settledAt))
		console.log(
			`${datetime.toLocaleString("en-AU")} - ${
				transaction.attributes.description
			} - ${timeCostVariable.hoursPortion} hours, ${
				timeCostVariable.minutesPortion
			} minutes and ${timeCostVariable.secondsPortion} seconds`
		)
	})
	return data
}

nextButton.addEventListener("click", () => {
	console.clear()
	if (!nextPage) {
		console.log("no next page")
	} else {
		getTransactions(nextPage, token)
	}
})

previousButton.addEventListener("click", () => {
	console.clear()
	if (!previousPage) {
		console.log("no previous page")
	} else {
		getTransactions(previousPage, token)
	}
})

getTransactions(transactionsURL, token)
