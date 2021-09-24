import { timeValue } from "./calculators.js"

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export async function renderBalance(balanceTimeValue) {
  const balanceElement = document.querySelector(".balance")
  const dollarBalanceElement = document.querySelector(".dollar-balance")
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

  const dollarBalanceString = `$${balanceObject.transactionBalanceDollarValue}`

  //Apply balanceString to the balance
  balanceElement.innerHTML = balanceString
  dollarBalanceElement.innerText = dollarBalanceString
}

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
      day: "numeric",
    })}, ${createdTime.toLocaleTimeString("en-AU", {
      timeStyle: "short",
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

//Construct and populate each transaction from the API call
export async function renderAccounts(getAccountsData, preferences) {
  const accounts = await getAccountsData

  const accountsList = document.querySelector(".accounts-container")

  accounts.forEach((account) => {
    //Get the timeValue of each account
    const timeValueObject = timeValue(
      account.dollarBalance / 100,
      preferences.rateObject
    )
    console.log(timeValueObject)

    //Grab the template from the HTML
    const accountTemplate = document.querySelector(".account-template")

    //firstElementChild converts the template to an actual HTML element
    //and lets assign IDs etc
    const elt = accountTemplate.content.firstElementChild.cloneNode(true)

    //Grab all the pieces of the element
    const accountName = elt.querySelector(".account-name")
    const accountTimeBalance = elt.querySelector(".account-time-balance")
    const accountDollarBalance = elt.querySelector(".account-dollar-balance")
    const accountType = elt.querySelector(".account-type")
    const accountEmoji = elt.querySelector(".account-emoji")
    let timeValueString

    if (preferences.survivalSavingsMode) {
      //Add leading zeros if applicable
      timeValueString = `${
        timeValueObject.survivalDailyPortion < 10
          ? "0" + timeValueObject.survivalDailyPortion
          : timeValueObject.survivalDailyPortion
      }d:${
        timeValueObject.survivalHoursPortion < 10
          ? "0" + timeValueObject.survivalHoursPortion
          : timeValueObject.survivalHoursPortion
      }h:${
        timeValueObject.survivalMinutesPortion < 10
          ? "0" + timeValueObject.survivalMinutesPortion
          : timeValueObject.survivalMinutesPortion
      }m`
    } else {
      //Add leading zeros if applicable
      timeValueString = `${
        timeValueObject.hoursPortion < 10
          ? "0" + timeValueObject.hoursPortion
          : timeValueObject.hoursPortion
      }h:${
        timeValueObject.minutesPortion < 10
          ? "0" + timeValueObject.minutesPortion
          : timeValueObject.minutesPortion
      }m`
    }

    accountTimeBalance.innerText = timeValueString

    const name = account.name.replace(/\p{Emoji}+/gu, "").trim()
    const emojiArray = account.name.match(/\p{Emoji}+/gu)
    let emoji
    if (emojiArray) {
      emoji = emojiArray[0]
    } else {
      emoji = "💰"
    }

    //Set all those elements
    accountName.innerText = name
    accountDollarBalance.innerText = formatter.format(
      account.dollarBalance / 100
    )

    accountType.innerText = account.type == "SAVER" ? "Saver" : "Spending"
    accountEmoji.innerText = emoji

    //Render transactions
    accountsList.appendChild(elt)
  })
}

export async function renderTotalBalance(getTotalBalanceData, preferences) {
  const balanceAmount = await getTotalBalanceData
  const totalBalance = document.querySelector(".total-balance")
  const totalDollarBalance = document.querySelector(".total-dollar-balance")
  const totalBalanceIndicator = document.querySelector(
    ".total-balance-indicator"
  )
  const timeValueObject = timeValue(balanceAmount / 100, preferences.rateObject)

  let timeValueString

  if (preferences.survivalSavingsMode) {
    //Add leading zeros if applicable
    timeValueString = `${
      timeValueObject.survivalDailyPortion < 10
        ? "0" + timeValueObject.survivalDailyPortion
        : timeValueObject.survivalDailyPortion
    }d:${
      timeValueObject.survivalHoursPortion < 10
        ? "0" + timeValueObject.survivalHoursPortion
        : timeValueObject.survivalHoursPortion
    }h:${
      timeValueObject.survivalMinutesPortion < 10
        ? "0" + timeValueObject.survivalMinutesPortion
        : timeValueObject.survivalMinutesPortion
    }m`
    totalBalanceIndicator.innerText = "Total survival balance"
  } else {
    //Add leading zeros if applicable
    timeValueString = `${
      timeValueObject.hoursPortion < 10
        ? "0" + timeValueObject.hoursPortion
        : timeValueObject.hoursPortion
    }h:${
      timeValueObject.minutesPortion < 10
        ? "0" + timeValueObject.minutesPortion
        : timeValueObject.minutesPortion
    }m`
    totalBalanceIndicator.innerText = "Total balance"
  }

  totalBalance.innerHTML = timeValueString

  totalDollarBalance.innerHTML = formatter.format(balanceAmount / 100)
}
