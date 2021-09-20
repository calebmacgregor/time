//Generic function to handle pinging various endpoints
export async function pingUp(url, token) {
	let response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	let data = await response.json()
	return data
}

//Return an array of every transactional account
export async function getTransactionAccounts(url, token) {
	let data = await pingUp(url, token)

	let accountID = await data.data.filter((account) => {
		if (account.attributes.accountType == "TRANSACTIONAL") {
			return account.id
		}
	})
	return accountID
}

//Return an array of every savings account
export async function getSaverAccounts(url, token) {
	let data = await pingUp(url, token)

	let accountID = await data.data.filter((account) => {
		if (account.attributes.accountType == "SAVER") {
			return account.id
		}
	})
	return accountID
}

//Return an array of every account
export async function getAccounts(url, token) {
	let data = await pingUp(url, token)

	let accountArray = await data.data.map((account) => {
		let accountObject = {}

		accountObject.id = account.id
		accountObject.dollarBalance = account.attributes.balance.valueInBaseUnits
		accountObject.type = account.attributes.accountType
		accountObject.name = account.attributes.displayName
		return accountObject
	})
	return accountArray
}

export async function getTotalBalance(url, token) {
	let data = await pingUp(url, token)

	let balanceValue = await data.data.reduce((previousValue, currentValue) => {
		return (
			previousValue + parseInt(currentValue.attributes.balance.valueInBaseUnits)
		)
	}, 0)

	return balanceValue
}

export async function keyValidation(url, token) {
	let response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	return response
}
