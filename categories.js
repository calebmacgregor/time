import {
  handleNavPanel,
  styleNavLinks,
  toggleCurrency,
  handleLogout,
  handleRefresh,
  disableScroll,
} from "./utilities.js"
import {
  getCategories,
  keyValidation,
  getTransactionsSince,
} from "./apiCallFunctions.js"
import { transactionsURL, categoriesURL, pingURL } from "./endpoints.js"
import {
  renderAggregatedCategoryTransactions,
  renderTotalExpenses,
} from "./render.js"

const preferences = JSON.parse(localStorage.getItem("TIME-preferences"))

///// Redirect to onboarding if key is bad /////
if (!preferences) {
  window.location.replace("./onboarding.html")
} else if (preferences) {
  let result = await keyValidation(pingURL, preferences.apiKey)
  if (result.ok == false) {
    window.location.replace("./onboarding.html")
  }
}

const categories = await getCategories(categoriesURL, preferences.apiKey)

const aggregatedTransactions = await getTransactionsSince(
  transactionsURL,
  preferences.apiKey,
  30
)
// const aggregatedTransactions = await getAggregatedTransactions(
//   transactionsURL,
//   preferences.apiKey,
//   categoryIDs,
//   30
// )

renderTotalExpenses(aggregatedTransactions, preferences)

renderAggregatedCategoryTransactions(
  aggregatedTransactions,
  preferences,
  categories
)

styleNavLinks()

///// Event listeners /////

//Toggle between currencies (time or dollars)
document.addEventListener("click", toggleCurrency)

//Open nav panel functionality
document.addEventListener("click", handleNavPanel)

//Logout functionality
document.addEventListener("click", handleLogout)

//Refresh functionality
document.addEventListener("click", handleRefresh)

//Disable scroll when panels are open
document.addEventListener("touchmove", disableScroll, { passive: false })
