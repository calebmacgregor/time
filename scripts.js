import { getTime, timeValue } from "./calculators.js"
import {
  pingUp,
  getTransactionAccounts,
  getSaverAccounts,
  getAccounts,
} from "./apiCallFunctions.js"

const token =
  "up:yeah:NULvDQe7lrgiG9eMgnbP62XrsuUUw2LDkQjN4J3hvFM5w0uTUQnBXtAT8pyjXu6hHk8cduezjrccrgKdRPutlTOX35qdlGJwXZsZCHGYQnAURAbhYSd15buR6v6eAWQr"

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL = "https://api.up.com.au/api/v1/transactions"

const list = document.querySelector(".list")

const rateObject = getTime(2880, 80)

let nextPage
let transactionArray = []

populateBalance(getBalance(accountsURL, token, rateObject))
renderTransactions(getTransactions(transactionsURL, token))

async function getBalance(accountsURL, token, rateObject) {
  const transactionAccount = await getTransactionAccounts(accountsURL, token)
  const transactionBalance = await transactionAccount.reduce((total, item) => {
    return total + parseFloat(item.attributes.balance.value)
  }, 0)

  const accounts = await getAccounts(accountsURL, token)
  const accountsBalance = await accounts.reduce((total, item) => {
    return total + parseFloat(item.attributes.balance.value)
  }, 0)

  const savingsAccounts = await getAccounts(accountsURL, token)
  const savingsBalance = await savingsAccounts.reduce((total, item) => {
    return total + parseFloat(item.attributes.balance.value)
  }, 0)

  const balanceTimeValue = timeValue(accountsBalance, rateObject)
  const transactionBalanceTimeValue = timeValue(transactionBalance, rateObject)
  return {
    balanceTimeValue: balanceTimeValue,
    transactionBalanceTimeValue: transactionBalanceTimeValue,
  }
}

async function populateBalance(balanceTimeValue) {
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

//Get transactions from Up and run them through
// the timevalue function
async function getTransactions(url, token) {
  console.log("getting transactions")
  let data = await pingUp(url, token)
  nextPage = await data.links.next
  transactionArray = transactionArray.concat(data.data)

  let output = await data.data.map((item) => {
    //Create an empty object
    let obj = {}
    //Populate that object with the data I need for renderTransactions
    obj.timeValueObject = timeValue(
      Math.abs(item.attributes.amount.value),
      rateObject
    )

    let transactionType

    if (item.relationships.transferAccount.data) {
      transactionType = "Transfer"
    } else {
      transactionType = "Expense"
    }

    obj.id = item.id
    obj.attributes = item.attributes
    obj.transactionType = transactionType
    obj.other = item

    return obj
  })
  console.log(output)

  return output
}

//Construct and populate each transaction from the API call
async function renderTransactions(pingUpData) {
  let data = await pingUpData

  data.forEach((item) => {
    //Get the timeValue of each transaction
    let timeValueObject = item.timeValueObject

    //Convert the settledTime value to a date
    const settledTime = item.attributes.settledAt
      ? new Date(item.attributes.settledAt)
      : new Date(item.attributes.createdAt)

    //Grab the template from the HTML
    const transactionTemplate = document.querySelector(".transaction-template")

    //firstElementChild converts the template to an actual HTML element
    //and lets assign IDs etc
    const elt = transactionTemplate.content.firstElementChild.cloneNode(true)

    const description = elt.querySelector(".description")
    const datetime = elt.querySelector(".datetime")
    const timeSpent = elt.querySelector(".time-spent")
    const moneySpent = elt.querySelector(".money-spent")

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
    datetime.innerText = `${settledTime.toLocaleString("en-AU", {
      month: "short",
      day: "numeric",
    })}, ${settledTime.toLocaleTimeString("en-AU", {
      timeStyle: "short",
    })}`
    timeSpent.innerText = timeValueString
    moneySpent.innerText = `$${timeValueObject.amount}`

    //Set the id to be the same as the transaction id from the API
    elt.id = item.id

    //Set the transaction type as a class
    elt.classList.add(item.transactionType.toLowerCase())

    //TODO: Come up with something that determines whether
    //transfer elements should be rendered.
    //Probably need to store this in the preferences
    //object (which hasn't been made yet)
    //Append the transaction element to List
    list.appendChild(elt)
  })
}

//Infinite scrolling logic
function infiniteScroll() {
  let scrollLocation = window.innerHeight + window.pageYOffset
  let scrollHeight = document.body.scrollHeight

  if (scrollLocation === scrollHeight) {
    if (!nextPage) {
      console.log("no next page")
    } else {
      renderTransactions(getTransactions(nextPage, token))
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

//Fade and scale down the balance on scroll
document.addEventListener("scroll", (e) => {
  const balanceContainer = document.querySelector(".balance-container")
  const balanceContainerHeight = balanceContainer.offsetHeight
  let scrollLocation = window.pageYOffset

  let percentVisibile = 1 - (scrollLocation * 1.5) / balanceContainerHeight

  percentVisibile > 0
    ? (balanceContainer.style.opacity = percentVisibile)
    : (balanceContainer.style.opacity = 0)
})

//Switches transactions between dollar and time views (time is default)
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("transaction-related")) return
  const transaction = e.target.closest(".transaction")

  const timeSpent = transaction.querySelector(".time-spent")
  const moneySpent = transaction.querySelector(".money-spent")

  timeSpent.classList.toggle("hidden")
  moneySpent.classList.toggle("hidden")
})

//GARBAGE CODE
//Spins the button
const simulate = document.querySelector(".simulate")

simulate.addEventListener("click", (e) => {
  simulate.classList.toggle("open")
  const transcations = Array.from(
    document.querySelectorAll(".transaction.transfer")
  )
  transcations.forEach((item) => {
    item.classList.toggle("hidden")

    setTimeout(() => {
      if (item.classList.contains("hidden")) {
        item.style.display = "none"
      } else {
        item.style.display = "flex"
      }
    }, 250)
  })
})

let lengthCheck = Array.from(document.querySelectorAll(".transaction")).length
//Length check event listener
document.addEventListener("click", () => {
  lengthCheck = Array.from(document.querySelectorAll(".transaction")).length

  if (lengthCheck < 20) {
    renderTransactions(getTransactions(nextPage, token))
  }
})
