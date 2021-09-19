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
	const balanceContainer = document.querySelector(".balance-container")
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

export function toggleBalanceCurrency(e) {
	const balanceContainer = e.target.closest(".balance-container")

	if (!balanceContainer) return

	const timeBalance = balanceContainer.querySelector(".balance")
	const dollarBalance = balanceContainer.querySelector(".dollar-balance")

	timeBalance.classList.toggle("hidden")
	dollarBalance.classList.toggle("hidden")
}

export function handleLogout(e) {
	if (!e.target.classList.contains("logout")) return
	localStorage.removeItem("TIME-preferences")
	preferences = ""
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
	const refreshLink = document.querySelector("#refresh-link")
	const logoutLink = document.querySelector("#logout-link")

	const linksArray = [homeLink, preferencesLink, refreshLink, logoutLink]

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
