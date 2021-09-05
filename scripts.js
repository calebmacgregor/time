import { getTime, timeCost } from "./calculators.js"
import { pingUp, getTransactionAccounts, getSaverAccounts } from "./accounts.js"

const token =
	"up:yeah:NULvDQe7lrgiG9eMgnbP62XrsuUUw2LDkQjN4J3hvFM5w0uTUQnBXtAT8pyjXu6hHk8cduezjrccrgKdRPutlTOX35qdlGJwXZsZCHGYQnAURAbhYSd15buR6v6eAWQr"

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL = "https://api.up.com.au/api/v1/transactions"

const content = document.querySelector("#content")

const rateObject = getTime(2880, 80)
const amountObject = timeCost(5.5, rateObject)

const rent = timeCost(360, rateObject)
console.log(
	`${rent.hoursPortion} hours, ${rent.minutesPortion} minutes, ${rent.secondsPortion} seconds`
)

getTransactionAccounts(transactionsURL, token)

async function getTransactions(url, token) {
	let response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	let data = await response.json()
	return data
}

getTransactions(transactionsURL, token).then((data) =>
	data.data.map((transaction) => {
		let card = {
			vendor: transaction.attributes.description,
			datetime: transaction.attributes.settledAt,
			timeObject: timeCost(
				Math.abs(transaction.attributes.amount.value),
				rateObject
			)
		}
		console.log(card)
		return card
	})
)

content.innerText = `That $${amountObject.amount} item cost you ${amountObject.hoursPortion} hours, ${amountObject.minutesPortion} minutes and ${amountObject.secondsPortion} seconds of your life`
