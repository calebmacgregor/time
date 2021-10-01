import { getCategories, getTransactionsSince } from "./apiCallFunctions.js"
import { transactionsURL, categoriesURL } from "./endpoints.js"
import {
  renderAggregatedCategoryTransactions,
  renderTotalExpenses,
} from "./render.js"

const preferences = JSON.parse(localStorage.getItem("TIME-preferences"))

const categories = await getCategories(categoriesURL, preferences.apiKey)

const aggregatedTransactions = await getTransactionsSince(
  transactionsURL,
  preferences.apiKey,
  30
)

renderTotalExpenses(aggregatedTransactions, preferences)

renderAggregatedCategoryTransactions(
  aggregatedTransactions,
  preferences,
  categories
)
