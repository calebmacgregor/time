import { keyValidation } from "./apiCallFunctions.js"
import {
  handleNavPanel,
  handleLogout,
  handleRefresh,
  toggleCurrency,
  disableScroll,
  styleNavLinks,
} from "./utilities.js"
import { pingURL } from "./endpoints.js"

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
