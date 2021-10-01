class NavPanel extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = `    
    <div class="nav-icon">
    <svg
      width="13"
      height="23"
      viewBox="0 0 13 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5607 12.5607C13.1464 11.9749 13.1464 11.0251 12.5607 10.4393L3.01472 0.893398C2.42893 0.307612 1.47918 0.307612 0.893398 0.893398C0.307612 1.47918 0.307612 2.42893 0.893398 3.01472L9.37868 11.5L0.893398 19.9853C0.307612 20.5711 0.307612 21.5208 0.893398 22.1066C1.47918 22.6924 2.42893 22.6924 3.01472 22.1066L12.5607 12.5607ZM10.5 13H11.5V10H10.5V13Z"
        fill="#EF496F"
      />
    </svg>
  </div>
    <div class="nav-panel tucked">
    <div class="nav-links">
      <div class="nav-link-container">
        <a href="index.html" class="nav-link" id="transactions-link"
          >Transactions</a
        >
      </div>
      <div class="nav-link-container">
        <a href="accounts.html" class="nav-link" id="accounts-link"
          >Accounts</a
        >
      </div>
       <div class="nav-link-container">
        <a href="categories.html" class="nav-link" id="categories-link"
          >Categories</a
        >
      </div>
      <div class="nav-link-container">
        <a href="preferences.html" class="nav-link" id="preferences-link"
          >Preferences</a
        >
      </div>
      <div class="nav-link-container">
        <a href="info.html" class="nav-link" id="info-link">Info</a>
      </div>
      <div class="nav-link-container">
        <p class="nav-link refresh" id="refresh-link">Refresh</p>
      </div>
      <div class="nav-link-container">
        <p class="nav-link logout" id="logout-link">Log out</p>
      </div>
    </div>
    <button class="logout">Logout</button>
  </div>`
  }
}

window.customElements.define("nav-panel", NavPanel)
