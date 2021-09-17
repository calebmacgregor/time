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
