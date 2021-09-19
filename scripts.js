import { timeValue } from "./calculators.js"
import { renderTransactions, renderBalance } from "./render.js"
import {
  pingUp,
  getTransactionAccounts,
  getAccounts,
  keyValidation,
} from "./apiCallFunctions.js"
import {
  handleNavPanel,
  handleCalculatorPanel,
  fadeBalance,
  toggleCurrency,
  disableScroll,
  handleLogout,
  handleRefresh,
  styleNavLinks,
} from "./utilities.js"
import { timeTransaction } from "./classes.js"
import { pingURL, accountsURL, transactionsURL } from "./endpoints.js"

///// Global variables /////
let nextPage
let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))

///// Redirect to onboarding if key is bad /////
if (!preferences) {
  window.location.replace("./onboarding.html")
} else if (preferences) {
  let result = await keyValidation(pingURL, preferences.apiKey)
  if (result.ok == false) {
    window.location.replace("./onboarding.html")
  }
}

///// Load initial page elements /////
renderBalance(
  getBalance(accountsURL, preferences.apiKey, preferences.rateObject)
)

renderTransactions(
  getTransactions(transactionsURL, preferences.apiKey, timeValue),
  preferences
)

styleNavLinks()

///// Event listeners /////

//Switches transactions between dollar and time views (time is default)
document.addEventListener("click", toggleCurrency)

//Check whether we need to grab more transactions
document.addEventListener("touchend", infiniteScroll)

//Fade and scale down the balance on scroll
document.addEventListener("scroll", fadeBalance)

// //Open nav panel functionality
document.addEventListener("click", handleNavPanel)

//Logout functionality
document.addEventListener("click", handleLogout)

//Refresh functionality
document.addEventListener("click", handleRefresh)

//Open calculator panel
document.addEventListener("click", handleCalculatorPanel)

//Handle calculating a time value on demand
document.addEventListener("input", handleCalculator)

//Disable scroll when panels are open
document.addEventListener("touchmove", disableScroll, { passive: false })

//Toggle between transactional and total views for balance
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("balance")) return
  e.target.classList.toggle("total")
  renderBalance(
    getBalance(accountsURL, preferences.apiKey, preferences.rateObject)
  )
})

///// Functions that can't live in modules /////
function handleCalculator(e) {
  //Check whether the clicked item is related to calculator input
  const calculatorInput = e.target.closest(".calculator-input")
  //If it's not, bail
  if (!calculatorInput) return
  //If it is, grab the calculator-result as well
  const calculatorResult = document.querySelector(".calculator-result")
  //Make sure it's a real number
  if (!isNaN(calculatorInput.value)) {
    const timeValueObject = timeValue(
      calculatorInput.value,
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

    calculatorResult.innerText = timeValueString
  }
}

//Infinite scrolling logic
function infiniteScroll() {
  let scrollLocation = window.innerHeight + window.pageYOffset
  let scrollHeight = document.body.scrollHeight

  if (scrollLocation / scrollHeight > 0.7) {
    if (!nextPage) {
    } else {
      renderTransactions(
        getTransactions(nextPage, preferences.apiKey, timeValue),
        preferences
      )
    }
  }
}

//Get transactions from Up and run them through
//the timevalue function
async function getTransactions(url, token) {
  let loader = document.querySelector(".loading")
  loader.classList.remove("inactive")
  let data = await pingUp(url, token)
  nextPage = await data.links.next
  let output = await data.data.map((item) => {
    return new timeTransaction(item, preferences.rateObject, timeValue)
  })
  loader.classList.add("inactive")
  return output
}

async function getBalance(accountsURL, token, rateObject) {
  let loader = document.querySelector(".loading")
  loader.classList.remove("inactive")
  const transactionAccount = await getTransactionAccounts(accountsURL, token)
  const transactionBalance = await transactionAccount.reduce((total, item) => {
    return total + parseFloat(item.attributes.balance.value)
  }, 0)

  const accounts = await getAccounts(accountsURL, token)
  const accountsBalance = await accounts.reduce((total, item) => {
    return total + parseFloat(item.attributes.balance.value)
  }, 0)

  const balanceTimeValue = timeValue(accountsBalance, rateObject)
  const transactionBalanceTimeValue = timeValue(transactionBalance, rateObject)
  loader.classList.add("inactive")
  return {
    balanceTimeValue: balanceTimeValue,
    transactionBalanceTimeValue: transactionBalanceTimeValue,
  }
}
