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

	let accountID = await data.data.filter((account) => {
		return account.id
	})
	return accountID
}
