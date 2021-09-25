import {
	styleNavLinks,
	handleNavPanel,
	handleLogout,
	handleRefresh,
	disableScroll
} from "./utilities.js"

styleNavLinks()

//Open nav panel functionality
document.addEventListener("click", handleNavPanel)

//Logout functionality
document.addEventListener("click", handleLogout)

//Refresh functionality
document.addEventListener("click", handleRefresh)

//Disable scroll when panels are open
document.addEventListener("touchmove", disableScroll, { passive: false })
