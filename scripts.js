import { getTime, timeValue } from "./calculators.js"
import { renderTransactions, renderBalance } from "./render.js"
import {
  pingUp,
  getTransactionAccounts,
  getSaverAccounts,
  getAccounts,
  keyValidation,
} from "./apiCallFunctions.js"
import { timeTransaction } from "./classes.js"

//Add

const pingURL = "https://api.up.com.au/api/v1/util/ping"
const accountsURL = "https://api.up.com.au/api/v1/accounts"
const transactionsURL =
  "https://api.up.com.au/api/v1/transactions?page[size]=50"

//Set some global variables
let nextPage
let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))

//Redirect if the key in storage is bad
if (!preferences) {
  window.location.replace("./onboarding.html")
} else if (preferences) {
  let result = await keyValidation(pingURL, preferences.apiKey)
  if (result.ok == false) {
    window.location.replace("./onboarding.html")
  }
}

const rateObject = preferences.rateObject

//Initial pageload transactions
renderBalance(getBalance(accountsURL, preferences.apiKey, rateObject))

renderTransactions(
  getTransactions(transactionsURL, preferences.apiKey, timeValue),
  preferences
)

//Get transactions from Up and run them through
//the timevalue function
export async function getTransactions(url, token) {
  let data = await pingUp(url, token)
  nextPage = await data.links.next
  let output = await data.data.map((item) => {
    return new timeTransaction(item, rateObject, timeValue)
  })
  return output
}

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

//Infinite scrolling logic
function infiniteScroll() {
  let scrollLocation = window.innerHeight + window.pageYOffset
  let scrollHeight = document.body.scrollHeight

  if (scrollLocation / scrollHeight > 0.8) {
    if (!nextPage) {
      console.log("no next page")
    } else {
      console.log("Grabbing new transactions")
      renderTransactions(
        getTransactions(nextPage, preferences.apiKey, timeValue),
        preferences
      )
    }
  }
}

//Set event handlers on touchstart and touchend
//This helps reduce the number of calls compared
//to using scroll
document.addEventListener("touchend", () => {
  infiniteScroll()
})

document.addEventListener("touchstart", () => {
  infiniteScroll()
})

//Toggle between transactional and total views for balance
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("balance")) return
  e.target.classList.toggle("total")
  renderBalance(getBalance(accountsURL, preferences.apiKey, rateObject))
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

//Handle calculating a time value on demand
const estimateInput = document.querySelector(".estimate-input")
const estimateResult = document.querySelector(".estimate-result")

estimateInput.addEventListener("input", () => {
  if (!isNaN(estimateInput.value)) {
    const timeValueObject = timeValue(
      estimateInput.value,
      preferences.rateObject
    )

    const timeValueString = `${
      timeValueObject.hoursPortion < 10
        ? "0" + timeValueObject.hoursPortion
        : timeValueObject.hoursPortion
    }h:${
      timeValueObject.minutesPortion < 10
        ? "0" + timeValueObject.minutesPortion
        : timeValueObject.minutesPortion
    }m`

    estimateResult.innerText = timeValueString
  }
})

//open estimate panel functionality
const estimatePanel = document.querySelector(".estimate-panel")
const closeButton = document.querySelector(".close-button")

closeButton.addEventListener("click", () => {
  //If you click the button when the panel is closed
  if (estimatePanel.classList.contains("hidden")) {
    closeButton.classList.remove("maximise")
    estimatePanel.style.display = "flex"
    setTimeout(() => {
      estimatePanel.classList.remove("hidden")
    }, 5)
  }
  //If you click the button when the panel is open
  else {
    closeButton.classList.add("maximise")
    estimatePanel.classList.toggle("hidden")
    setTimeout(() => {
      estimatePanel.style.display = "none"
    }, 251)
  }
})

//Open nav panel functionality
const navIcon = document.querySelector(".nav-icon")
const navPanel = document.querySelector(".nav-panel")

navIcon.addEventListener("click", () => {
  navPanel.classList.toggle("hidden")
  navIcon.classList.toggle("expanded")
  if (!navPanel.classList.contains("hidden")) {
    navIcon.style.zIndex = 1000
  } else {
    navIcon.style.zIndex = 2
  }
})

//Disable scroll when panels are open

document.addEventListener(
  "touchmove",
  (e) => {
    if (estimatePanel.classList.contains("hidden")) return
    e.preventDefault()
  },
  { passive: false }
)

document.addEventListener(
  "touchmove",
  (e) => {
    if (navPanel.classList.contains("hidden")) return
    e.preventDefault()
  },
  { passive: false }
)

//Logout functionality
const logout = document.querySelector(".logout")

logout.addEventListener("click", (e) => {
  localStorage.removeItem("TIME-preferences")
  preferences = ""
  location.reload()
})
