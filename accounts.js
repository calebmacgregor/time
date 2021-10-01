import { getAccounts, getTotalBalance } from "./apiCallFunctions.js"
import { accountsURL } from "./endpoints.js"
import { renderAccounts, renderTotalBalance } from "./render.js"

const preferences = JSON.parse(localStorage.getItem("TIME-preferences"))

renderAccounts(getAccounts(accountsURL, preferences.apiKey), preferences)

renderTotalBalance(
  getTotalBalance(accountsURL, preferences.apiKey),
  preferences
)
