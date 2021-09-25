import {
  handleNavPanel,
  handleRefresh,
  handleLogout,
  disableScroll,
  toggleCurrency,
} from "./utilities.js"
import {
  getAccounts,
  getTotalBalance,
  keyValidation,
} from "./apiCallFunctions.js"
import { accountsURL, pingURL } from "./endpoints.js"
import { renderAccounts, renderTotalBalance } from "./render.js"
import { styleNavLinks } from "./utilities.js"

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

styleNavLinks()

renderAccounts(getAccounts(accountsURL, preferences.apiKey), preferences)

renderTotalBalance(
  getTotalBalance(accountsURL, preferences.apiKey),
  preferences
)

//Open nav panel functionality
document.addEventListener("click", handleNavPanel)

//Logout functionality
document.addEventListener("click", handleLogout)

//Refresh functionality
document.addEventListener("click", handleRefresh)

//Toggle currency between hours and dollars
document.addEventListener("click", toggleCurrency)

//Disable scroll when panels are open
document.addEventListener("touchmove", disableScroll, { passive: false })
