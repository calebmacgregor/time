export function createTransactionElement(
	timeCostObject,
	descriptionString,
	settledAt
) {
	const transaction = document.createElement("div")
	transaction.className = "transaction"

	const left = document.createElement("div")
	left.className = "left"

	const description = document.createElement("h4")
	description.className = "description"
	description.innerText = descriptionString

	const datetime = document.createElement("h4")
	datetime.className = "datetime"
	datetime.innerText = settledAt

	left.appendChild(description)
	left.appendChild(datetime)

	const right = document.createElement("div")
	right.className = "right"

	const timeSpent = document.createElement("h2")
	timeSpent.className = "time-spent"
	timeSpent.innerText = `${timeCostObject.hoursPortion}h:${timeCostObject.minutesPortion}m:${timeCostObject.secondsPortion}s`

	right.appendChild(timeSpent)

	transaction.appendChild(left)
	transaction.appendChild(right)

	return transaction
}
