import { handleNavPanel, styleNavLinks } from "./utilities.js"
import {
	getCategoryTransactions,
	getCategories,
	getAggregatedTransactions,
	pingUp
} from "./apiCallFunctions.js"
import { transactionsURL } from "./endpoints.js"

let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))

styleNavLinks()

const categoriesURL = "https://api.up.com.au/api/v1/categories"
const categories = await getCategories(categoriesURL, preferences.apiKey)
const categoryIDs = categories.map((item) => item.id)
console.log(categories)

document.addEventListener("click", handleNavPanel)

const aggregatedTransactions = await getAggregatedTransactions(
	transactionsURL,
	preferences.apiKey,
	categoryIDs,
	5
)

console.log(aggregatedTransactions)

async function renderAggregatedCategoryTransactions(aggregatedTransactions) {
	const data = await aggregatedTransactions

	console.log(data)
	data.forEach((aggregate) => {
		console.log(aggregate)
		const categoryList = document.querySelector(".category-list")
		const categoryTemplate = document.querySelector(".category-template")

		//firstElementChild converts the template to an actual HTML element
		//and lets assign IDs etc
		const elt = categoryTemplate.content.firstElementChild.cloneNode(true)
		const categoryName = elt.querySelector(".category-name")
		const categoryValue = elt.querySelector(".category-value")

		categoryName.innerText = aggregate.category
		categoryValue.innerText = aggregate.value

		categoryList.appendChild(elt)
	})
}

renderAggregatedCategoryTransactions(aggregatedTransactions)
