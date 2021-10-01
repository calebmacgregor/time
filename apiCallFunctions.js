//Generic function to handle pinging various endpoints
export async function pingUp(url, token) {
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  // console.log(response)
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
      Authorization: `Bearer ${token}`,
    },
  })
  return response
}

export async function getTransactionsSince(url, token, daysBack) {
  const output = []
  let loader = document.querySelector(".loading")
  loader.classList.remove("inactive")

  //Loop through every category and grab the transactions
  let nextPage = url

  //Create a new date object
  const dateOfInterest = new Date()

  //Offset that date by the daysBack parameter
  dateOfInterest.setDate(dateOfInterest.getDate() - daysBack)

  while (nextPage) {
    //Build the parameters to construct the URL
    const urlAppender = `&filter[since]=${dateOfInterest.toISOString()}`

    //Ping up to grab every transaction
    let data = await pingUp(nextPage + urlAppender, token)

    //Add latest loop to the array
    output.push(...data.data)

    //Set the next URL for the loop, or Null if there are no next pages
    nextPage = data.links.next
  }

  const grouped = []

  output.forEach((item) => {
    let currentCategory = item.relationships.category.data
      ? item.relationships.category.data.id
      : "Uncategorised"

    if (!grouped.find((element) => element.category == currentCategory)) {
      let obj = {
        category: undefined,
        value: 0,
      }

      obj.category = currentCategory
      obj.value = item.attributes.amount.valueInBaseUnits
      grouped.push(obj)
    } else {
      let thing = grouped.find((element) => element.category == currentCategory)
      thing.value += item.attributes.amount.valueInBaseUnits
    }
  })

  loader.classList.add("inactive")
  return grouped
}

export async function getCategoryTransactions(url, token, categoryArray) {
  let output = []

  for (const category of categoryArray) {
    let nextPage
    if (!nextPage) {
      const urlAppender = `&filter[category]=${category}`
      let data = await pingUp(url + urlAppender, token)
      output.push(...data.data)
    } else if (nextPage) {
      let data = await pingUp(nextPage, token)
      output.push(...data.data)
    }
  }
  return output
}

export async function getCategories(url, token) {
  let data = await pingUp(url, token)

  let categories = []

  await data.data.forEach((item) => {
    if (item.relationships.children.data.length > 0) return
    let category = {
      id: item.id,
      name: item.attributes.name,
    }
    categories.push(category)
  })
  return categories
}
