import { getTime, timeCost } from "./calculators.js"
import { pingUp, getTransactionAccounts, getSaverAccounts } from "./accounts.js"
import { createTransactionElement } from "./createElements.js"

const token =
	"up:yeah:NULvDQe7lrgiG9eMgnbP62XrsuUUw2LDkQjN4J3hvFM5w0uTUQnBXtAT8pyjXu6hHk8cduezjrccrgKdRPutlTOX35qdlGJwXZsZCHGYQnAURAbhYSd15buR6v6eAWQr"

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL = "https://api.up.com.au/api/v1/transactions"

const nextButton = document.querySelector("#next")
const previousButton = document.querySelector("#previous")
const list = document.querySelector(".list")

const rateObject = getTime(2880, 80)
const timeSpentObject = timeCost(5, rateObject)

console.log(createTransactionElement(timeSpentObject))

let nextPage
let previousPage
let transactionArray = []

async function getTransactions(url, token) {
	let data = await pingUp(url, token)
	nextPage = await data.links.next
	previousPage = await data.links.prev

	await data.data.forEach((item) => {
		console.log(typeof item)
		transactionArray.push(item)

		let timeCostObject = timeCost(
			Math.abs(item.attributes.amount.value),
			rateObject
		)
		let elt = createTransactionElement(
			timeCostObject,
			item.attributes.description,
			item.attributes.settledAt
		)

		list.appendChild(elt)
	})

	console.log(transactionArray)

	// await transactionArray.forEach((transaction) => {
	// 	let timeCostObject = timeCost(
	// 		Math.abs(transaction.attributes.amount.value),
	// 		rateObject
	// 	)
	// 	let elt = createTransactionElement(timeCostObject, transaction)

	// 	list.appendChild(elt)
	// })
	return data
}

nextButton.addEventListener("click", () => {
	console.clear()
	if (!nextPage) {
		console.log("no next page")
	} else {
		getTransactions(nextPage, token)
		console.log(transactionArray)
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

// function constructString(costObject) {
// 	if (
// 		costObject.hoursPortion &&
// 		costObject.minutesPortion &&
// 		costObject.secondsPortion
// 	) {
// 		return `${costObject.hoursPortion} hours, ${costObject.minutesPortion} minutes and ${costObject.secondsPortion} seconds`
// 	} else if (
// 		costObject.hoursPortion &&
// 		costObject.minutesPortion &&
// 		!costObject.secondsPortion
// 	) {
// 		return `${costObject.hoursPortion} hours and ${costObject.minutesPortion} minutes`
// 	} else if (
// 		!costObject.hoursPortion &&
// 		costObject.minutesPortion &&
// 		costObject.secondsPortion
// 	) {
// 		return `${costObject.minutesPortion} minutes and ${costObject.secondsPortion} seconds`
// 	} else if (
// 		!costObject.hoursPortion &&
// 		!costObject.minutesPortion &&
// 		costObject.secondsPortion
// 	) {
// 		return `${costObject.secondsPortion} seconds`
// 	} else if (
// 		!costObject.hoursPortion &&
// 		costObject.minutesPortion &&
// 		!costObject.secondsPortion
// 	) {
// 		return `${costObject.minutesPortion} minutes`
// 	}
// }

// data.data.forEach((transaction) => {
// 	let timeCostVariable = timeCost(
// 		Math.abs(transaction.attributes.amount.value),
// 		rateObject
// 	)
// 	let datetime = new Date(Date.parse(transaction.attributes.settledAt))

// 	console.log(
// 		`${datetime.toLocaleString("en-AU")} - ${
// 			transaction.attributes.description
// 		} - ${constructString(timeCostVariable)}`
// 	)
// })
