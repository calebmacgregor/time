import { handleNavPanel, styleNavLinks } from "./utilities.js"
import { pingUp } from "./apiCallFunctions.js"
import { transactionsURL } from "./endpoints.js"

const categoriesURL = "https://api.up.com.au/api/v1/categories"

let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))

styleNavLinks()

document.addEventListener("click", handleNavPanel)

async function getCategories(url, token) {
	let data = await pingUp(url, token)

	let categories = []

	await data.data.forEach((item) => {
		let category = {
			id: item.id,
			name: item.attributes.name
		}
		categories.push(category)
	})
	return categories
}

getCategories(categoriesURL, preferences.apiKey).then((data) =>
	console.log(data)
)

async function recursionTest(url, token, categoryArray) {
	let output = []

	for (const category in categoryArray) {
		let nextPage = url
		let adder

		while (nextPage) {
			console.log("looping")
			const urlAppender = `&filter[category]=${categoryArray[category]}`
			let data = await pingUp(nextPage + urlAppender, token)
			output.push(...data.data)
			nextPage = data.links.next
		}
	}
	return output
}

recursionTest(transactionsURL, preferences.apiKey, [
	"games-and-software",
	"utilities",
	"fuel",
	"events-and-gigs"
]).then((data) => {
	let grouped = data.reduce((categories, value) => {
		const category = value.relationships.category.data.id
		if (categories[category] == null) categories[category] = 0
		categories[category] += Math.abs(value.attributes.amount.value)
		return categories
	}, {})
	console.log(grouped)
})
