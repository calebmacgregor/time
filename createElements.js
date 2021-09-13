export function createTransactionElement(
	timeValueObject,
	descriptionString,
	settledAt
) {
	const transactionTemplate = document.querySelector(".transaction-template")

	//firstElementChild converts the template to an actual HTML element
	//and lets assign IDs etc
	const transactionContent =
		transactionTemplate.content.firstElementChild.cloneNode(true)

	const description = transactionContent.querySelector(".description")
	const datetime = transactionContent.querySelector(".datetime")
	const timeSpent = transactionContent.querySelector(".time-spent")
	const moneySpent = transactionContent.querySelector(".money-spent")

	const timeValueString = `${
		timeValueObject.hoursPortion < 10
			? "0" + timeValueObject.hoursPortion
			: timeValueObject.hoursPortion
	}h:${
		timeValueObject.minutesPortion < 10
			? "0" + timeValueObject.minutesPortion
			: timeValueObject.minutesPortion
	}m`

	description.innerText = descriptionString
	datetime.innerText = settledAt
	timeSpent.innerText = timeValueString
	moneySpent.innerText = `$${timeValueObject.amount}`

	return transactionContent
}
