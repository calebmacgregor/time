export class Preferences {
	constructor(
		apiKey,
		hideTransfers,
		afterTaxPay,
		hoursWorked,
		rateObject,
		expenses
	) {
		this.apiKey = apiKey
		this.hideTransfers = hideTransfers
		this.afterTaxPay = afterTaxPay
		this.hoursWorked = hoursWorked
		this.expenses = parseFloat(expenses)
		this.rateObject = rateObject
	}
}

export class timeTransaction {
	constructor(upTransaction, ratebject, timeValueFunction) {
		this.id = upTransaction.id
		this.attributes = upTransaction.attributes
		this.other = upTransaction
		this.timeValueObject = timeValueFunction(
			Math.abs(upTransaction.attributes.amount.value),
			ratebject
		)
		this.transactionType = upTransaction.relationships.transferAccount.data
			? "Transfer"
			: "Expense"
		this.isPositive = upTransaction.attributes.amount.value > 0 ? true : false
	}
}
