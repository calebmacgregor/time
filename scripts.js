import { getTime, timeValue } from "./calculators.js"
import {
  pingUp,
  getTransactionAccounts,
  getSaverAccounts,
  getAccounts,
} from "./accounts.js"
import { createTransactionElement } from "./createElements.js"

const token =
  "up:yeah:NULvDQe7lrgiG9eMgnbP62XrsuUUw2LDkQjN4J3hvFM5w0uTUQnBXtAT8pyjXu6hHk8cduezjrccrgKdRPutlTOX35qdlGJwXZsZCHGYQnAURAbhYSd15buR6v6eAWQr"

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL = "https://api.up.com.au/api/v1/transactions"

const list = document.querySelector(".list")

const rateObject = getTime(2880, 80)

let nextPage
let previousPage
// let transactionArray = []

populateBalance(getBalance(accountsURL, token, rateObject))
populateTransactions(transactionsURL, token)

async function getBalance(accountsURL, token, rateObject) {
  const transactionAccount = await getTransactionAccounts(accountsURL, token)
  const transactionBalance = await transactionAccount[0].attributes.balance
    .value

  const accounts = await getAccounts(accountsURL, token)
  const accountsBalance = await accounts.reduce((total, item) => {
    return total + parseFloat(item.attributes.balance.value)
  }, 0)

  const balanceTimeValue = timeValue(accountsBalance, rateObject)
  const transactionBalanceTimeValue = timeValue(transactionBalance, rateObject)
  // return balanceTimeValue
  return {
    balanceTimeValue: balanceTimeValue,
    transactionBalanceTimeValue: transactionBalanceTimeValue,
  }
}

//TODO This feels like a clunky way to run an if statement
//Come up with something better to toggle between balances
async function populateBalance(balanceTimeValue) {
  const balanceElement = document.querySelector(".balance")
  const balanceObject = await balanceTimeValue

  if (balanceElement.classList.contains("total")) {
    const chosenObject = balanceObject.balanceTimeValue
    const balanceString = `${
      chosenObject.hoursPortion < 10
        ? "0" + chosenObject.hoursPortion
        : chosenObject.hoursPortion
    }h:${
      chosenObject.minutesPortion < 10
        ? "0" + chosenObject.minutesPortion
        : chosenObject.minutesPortion
    }m`
    balanceElement.innerHTML = balanceString
  } else {
    const chosenObject = balanceObject.transactionBalanceTimeValue
    const balanceString = `${
      chosenObject.hoursPortion < 10
        ? "0" + chosenObject.hoursPortion
        : chosenObject.hoursPortion
    }h:${
      chosenObject.minutesPortion < 10
        ? "0" + chosenObject.minutesPortion
        : chosenObject.minutesPortion
    }m`
    balanceElement.innerHTML = balanceString
  }
}

//Construct and populate each transaction from the API call
async function populateTransactions(url, token) {
  let data = await pingUp(url, token)
  nextPage = await data.links.next
  previousPage = await data.links.prev

  await data.data.forEach((item) => {
    // transactionArray.push(item)

    //Get the timeValue of each transaction
    let timeValueObject = timeValue(
      Math.abs(item.attributes.amount.value),
      rateObject
    )

    //Convert the settledTime value to a date
    const settledTime = new Date(item.attributes.settledAt)

    //Create the transaction element
    let elt = createTransactionElement(
      timeValueObject,
      item.attributes.description,
      settledTime.toLocaleString("en-AU", {
        month: "short",
        day: "numeric",
      })
    )

    //Append the transaction element to List
    list.appendChild(elt)
  })

  return data
}

//Infinite scrolling logic

function infiniteScroll() {
  let scrollLocation = window.innerHeight + window.pageYOffset
  let scrollHeight = document.body.scrollHeight

  if (scrollLocation === scrollHeight) {
    if (!nextPage) {
      console.log("no next page")
    } else {
      populateTransactions(nextPage, token)
    }
  }
}

document.addEventListener("scroll", () => {
  infiniteScroll()
})

//Toggle between transactional and total views for balance
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("balance")) return
  e.target.classList.toggle("total")
  populateBalance(getBalance(accountsURL, token, rateObject))
})
