import { getRateObject } from "./calculators.js"
import { keyValidation } from "./apiCallFunctions.js"
import { Preferences } from "./classes.js"
import { pingURL } from "./endpoints.js"

export function handleNavPanel(e) {
	const navIcon = e.target.closest(".nav-icon")
	if (!navIcon) return

	const navPanel = document.querySelector(".nav-panel")

	navPanel.classList.toggle("tucked")
	navIcon.classList.toggle("expanded")
}

export function handleNaveClose(e) {
	const globalNavPanel = document.querySelector(".nav-panel")
	const globalNavIcon = document.querySelector(".nav-icon")
	const navPanelTarget = e.target.closest("nav-panel")
	if (!navPanelTarget && !globalNavPanel.classList.contains("tucked")) {
		globalNavPanel.classList.add("tucked")
		globalNavIcon.classList.remove("expanded")
	}
}

export function handleCalculatorPanel(e) {
	const calculatorButton = e.target.closest(".calculator-button")
	if (!calculatorButton) return

	const calculatorPanel = document.querySelector(".calculator-panel")
	const calculatorInput = document.querySelector(".calculator-input")
	const calculatorResult = document.querySelector(".calculator-result")

	calculatorButton.classList.toggle("maximise")
	calculatorPanel.classList.toggle("tucked")
	calculatorInput.value = ""
	calculatorResult.innerText = "Calculator"
}

export function disableScroll(e) {
	const navPanel = document.querySelector(".nav-panel")
	const calculatorPanel = document.querySelector(".calculator-panel")
	if (
		navPanel.classList.contains("tucked") &&
		(calculatorPanel == null || calculatorPanel.classList.contains("tucked"))
	)
		return
	e.preventDefault()
}

export function fadeBalance() {
	const balanceContainer = document.querySelector(".balance-container-wrapper")
	const balanceContainerHeight = balanceContainer.offsetHeight
	let scrollLocation = window.pageYOffset

	let percentVisibile = 1 - (scrollLocation * 1.5) / balanceContainerHeight

	percentVisibile > 0
		? (balanceContainer.style.opacity = percentVisibile)
		: (balanceContainer.style.opacity = 0)
}

export function toggleCurrency(e) {
	const valueContainer = e.target.closest(".value-container")

	if (!valueContainer) return

	const timeValue = valueContainer.querySelector(".time-value")
	const dollarValue = valueContainer.querySelector(".dollar-value")

	timeValue.classList.toggle("hidden")
	dollarValue.classList.toggle("hidden")
}

export function handleLogout(e) {
	if (!e.target.classList.contains("logout")) return
	localStorage.removeItem("TIME-preferences")
	let preferences = ""
	location.reload()
}

export function handleRefresh(e) {
	if (!e.target.classList.contains("refresh")) return
	location.reload()
}

export function styleNavLinks() {
	//Grab all nav links
	const transactionsLink = document.querySelector("#transactions-link")
	const accountsLink = document.querySelector("#accounts-link")
	const categoriesLink = document.querySelector("#categories-link")
	const infoLink = document.querySelector("#info-link")
	const preferencesLink = document.querySelector("#preferences-link")
	const refreshLink = document.querySelector("#refresh-link")
	const logoutLink = document.querySelector("#logout-link")

	const linksArray = [
		transactionsLink,
		accountsLink,
		categoriesLink,
		infoLink,
		preferencesLink,
		refreshLink,
		logoutLink
	]

	//Remove active statuses of all links
	linksArray.forEach((link) => {
		link.classList.remove("active")
	})

	//This is broken into pieces because if it isn't then Safari mobile cries
	const currentLocationPathname = window.location.pathname
	const currentLocationArray = currentLocationPathname.split("/")
	const arrayLength = currentLocationArray.length
	const currentLocation = currentLocationArray[arrayLength - 1]

	//Grab the current page and style that
	linksArray.forEach((link) => {
		if (link.getAttribute("href") == currentLocation) {
			link.classList.add("active")
		}
	})
}

export function setPreferences(e) {
	const submit = e.target.closest(".submit")
	if (!submit) return

	e.preventDefault()
	//Grab all error elements
	const timeError = document.querySelector(".time-error")
	const dollarsError = document.querySelector(".dollars-error")
	const expenseError = document.querySelector(".expense-error")
	const apiError = document.querySelector(".api-error")

	//Grab all input elements
	const payInput = document.querySelector(".dollars-input")
	const timeInput = document.querySelector(".time-input")
	const expenseInput = document.querySelector(".expense-input")
	const keyInput = document.querySelector(".api-key-input")
	const survivalInput = document.querySelector(".survival-savings-input")

	//Reset the error messages
	dollarsError.style.display = "none"
	timeError.style.display = "none"
	expenseError.style.display = "none"
	apiError.style.display = "none"

	const pay = parseFloat(payInput.value)
	const time = parseInt(timeInput.value)
	const expense = expenseInput.value
	const apiKey = keyInput.value
	const survivalMode = survivalInput.checked
	const response = keyValidation(pingURL, apiKey)

	//Check whether numbers are valid
	const validPay = isNaN(pay) ? false : true
	const validTime = isNaN(time) ? false : true
	const validExpense =
		(isNaN(expense) && expense.length > 0) || expense == null ? false : true
	let validKey

	response.then((data) => {
		//Set the validity of the validKey
		//Use this below for error message population
		if (data.ok) {
			validKey = true
		} else {
			validKey = false
		}
		if (data.ok == true && validPay && validTime && validExpense) {
			//Construct the preferences object
			let newPreferences = new Preferences(
				apiKey,
				true,
				pay,
				time,
				getRateObject(pay, time, expense),
				expense,
				survivalMode
			)

			//Put the preferences object into localstorage
			localStorage.setItem("TIME-preferences", JSON.stringify(newPreferences))

			//Redirect to the main page
			window.location.replace(document.referrer)
		} else {
			if (!validPay) {
				dollarsError.style.display = "block"
			}
			if (!validTime) {
				timeError.style.display = "block"
			}
			if (!validExpense) {
				expenseError.style.display = "block"
			}
			if (!validKey) {
				apiError.style.display = "block"
			}
		}
	})
}

export function selectInputOnClick(e) {
	const inputElement = e.target.closest(".selectable-input")
	if (!inputElement) return
	inputElement.select()
}

export async function getTotalExpenses(aggregatedTransactions) {
	let totalExpenses = await aggregatedTransactions.reduce((total, current) => {
		return total + current.value
	}, 0)
	totalExpenses = Math.abs(totalExpenses)
	return totalExpenses
}
