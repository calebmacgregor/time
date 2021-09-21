import { getTime } from "./calculators.js"
import { keyValidation } from "./apiCallFunctions.js"
import { Preferences } from "./classes.js"
import { pingURL } from "./endpoints.js"

export function handleNavPanel(e) {
	const navIcon = e.target.closest(".nav-icon")
	const navPanel = document.querySelector(".nav-panel")
	if (!navIcon) return
	navPanel.classList.toggle("hidden")
	navIcon.classList.toggle("expanded")
	if (!navPanel.classList.contains("hidden")) {
		navIcon.style.zIndex = 1000
	} else {
		navIcon.style.zIndex = 2
	}
}

export function handleCalculatorPanel(e) {
	const calculatorButton = e.target.closest(".calculator-button")
	if (!calculatorButton) return
	const calculatorPanel = document.querySelector(".calculator-panel")
	const calculatorInput = document.querySelector(".calculator-input")
	const calculatorResult = document.querySelector(".calculator-result")
	//If you click the button when the panel is closed
	if (calculatorPanel.classList.contains("hidden")) {
		calculatorButton.classList.remove("maximise")
		calculatorPanel.style.display = "flex"
		setTimeout(() => {
			calculatorPanel.classList.remove("hidden")
		}, 5)
	}
	//If you click the button when the panel is open
	else {
		calculatorInput.value = ""
		calculatorResult.innerText = "Calculator"
		calculatorButton.classList.add("maximise")
		calculatorPanel.classList.toggle("hidden")
		setTimeout(() => {
			calculatorPanel.style.display = "none"
		}, 251)
	}
}

export function disableScroll(e) {
	const navPanel = document.querySelector(".nav-panel")
	const calculatorPanel = document.querySelector(".calculator-panel")
	if (
		navPanel.classList.contains("hidden") &&
		calculatorPanel.classList.contains("hidden")
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

export function toggleTransactionCurrency(e) {
	if (!e.target.classList.contains("transaction-related")) return
	const transaction = e.target.closest(".transaction")

	const timeSpent = transaction.querySelector(".time-spent")
	const moneySpent = transaction.querySelector(".money-spent")

	timeSpent.classList.toggle("hidden")
	moneySpent.classList.toggle("hidden")
}

export function toggleAccountCurrency(e) {
	if (!e.target.classList.contains("account-related")) return
	const account = e.target.closest(".account")

	const timeBalance = account.querySelector(".account-time-balance")
	const dollarBalance = account.querySelector(".account-dollar-balance")

	timeBalance.classList.toggle("hidden")
	dollarBalance.classList.toggle("hidden")
}

export function toggleBalanceCurrency(e) {
	const balanceContainer = e.target.closest(".balance-container")

	if (!balanceContainer) return

	const timeBalance = balanceContainer.querySelector(".balance")
	const dollarBalance = balanceContainer.querySelector(".dollar-balance")

	timeBalance.classList.toggle("hidden")
	dollarBalance.classList.toggle("hidden")
}

export function toggleTotalBalanceCurrency(e) {
	const totalBalanceContainer = e.target.closest(".total-balance-container")

	if (!totalBalanceContainer) return

	const timeBalance = totalBalanceContainer.querySelector(".total-balance")
	const dollarBalance = totalBalanceContainer.querySelector(
		".total-dollar-balance"
	)

	timeBalance.classList.toggle("hidden")
	dollarBalance.classList.toggle("hidden")
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
	const homeLink = document.querySelector("#home-link")
	const preferencesLink = document.querySelector("#preferences-link")
	const accountsLink = document.querySelector("#accounts-link")
	const refreshLink = document.querySelector("#refresh-link")
	const logoutLink = document.querySelector("#logout-link")

	const linksArray = [
		homeLink,
		preferencesLink,
		accountsLink,
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

	//Reset the error messages
	dollarsError.style.display = "none"
	timeError.style.display = "none"
	expenseError.style.display = "none"
	apiError.style.display = "none"

	const pay = parseFloat(payInput.value)
	const time = parseInt(timeInput.value)
	const expense = expenseInput.value
	const apiKey = keyInput.value
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
				getTime(pay, time, expense),
				expense
			)

			//Put the preferences object into localstorage
			localStorage.setItem("TIME-preferences", JSON.stringify(newPreferences))

			//Redirect to the main page
			window.location.replace("./")
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
