//Construct and populate each transaction from the API call
export async function renderTransactions(getTransactionsData, preferences) {
	let data = await getTransactionsData

	data.forEach((item) => {
		//Get the timeValue of each transaction
		let timeValueObject = item.timeValueObject

		//Convert the createdTime value to a date
		const createdTime = new Date(item.attributes.createdAt)

		//Grab the template from the HTML
		const transactionTemplate = document.querySelector(".transaction-template")

		//firstElementChild converts the template to an actual HTML element
		//and lets assign IDs etc
		const elt = transactionTemplate.content.firstElementChild.cloneNode(true)

		const description = elt.querySelector(".description")
		const datetime = elt.querySelector(".datetime")
		const timeSpent = elt.querySelector(".time-spent")
		const moneySpent = elt.querySelector(".money-spent")
		const positiveIndicator = elt.querySelector(".positive-indicator")

		//Add leading zeros if applicable
		const timeValueString = `${
			timeValueObject.hoursPortion < 10
				? "0" + timeValueObject.hoursPortion
				: timeValueObject.hoursPortion
		}h:${
			timeValueObject.minutesPortion < 10
				? "0" + timeValueObject.minutesPortion
				: timeValueObject.minutesPortion
		}m`

		description.innerText = item.attributes.description
		datetime.innerText = `${createdTime.toLocaleString("en-AU", {
			month: "short",
			day: "numeric"
		})}, ${createdTime.toLocaleTimeString("en-AU", {
			timeStyle: "short"
		})}`
		timeSpent.innerText = timeValueString
		moneySpent.innerText = `$${timeValueObject.amount}`

		//Set the id to be the same as the transaction id from the API
		elt.id = item.id

		//Add a Positive class if the transaction is positive
		item.isPositive
			? positiveIndicator.classList.add("positive")
			: positiveIndicator.classList.add("hidden")

		//Set the transaction type as a class
		elt.classList.add(item.transactionType.toLowerCase())

		//Render transactions based on whether
		//you choose to hide transfers or not
		if (preferences.hideTransfers == true) {
			if (!elt.classList.contains("transfer")) {
				list.appendChild(elt)
			}
		} else {
			list.appendChild(elt)
		}
	})
}

export async function renderBalance(balanceTimeValue) {
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
