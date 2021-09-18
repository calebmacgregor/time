import { getTime } from "./calculators.js"
import { keyValidation } from "./apiCallFunctions.js"
import { Preferences } from "./classes.js"
import { pingURL } from "./endpoints.js"

const submit = document.querySelector(".submit")
const keyInput = document.querySelector(".api-key-input")
const payInput = document.querySelector(".dollars-input")
const timeInput = document.querySelector(".time-input")

const timeError = document.querySelector(".time-error")
const dollarsError = document.querySelector(".dollars-error")
const apiError = document.querySelector(".api-error")

//Redirect if the key in storage is valid
let preferences = JSON.parse(localStorage.getItem("TIME-preferences"))
if (preferences) {
  let result = await keyValidation(pingURL, preferences.apiKey)
  if (result.ok == true) {
    console.log("redirecting")
    window.location.replace("./")
  }
}

submit.addEventListener("click", (e) => {
  e.preventDefault()

  //Reset the error messages
  dollarsError.style.display = "none"
  timeError.style.display = "none"
  apiError.style.display = "none"

  //Grab the values from each input
  const pay = parseInt(payInput.value)
  const time = parseInt(timeInput.value)
  const apiKey = keyInput.value

  //Ping API to seeif key is valid
  const response = keyValidation(pingURL, apiKey)

  //Check whether numbers are valid
  const validPay = isNaN(pay) ? false : true
  const validTime = isNaN(time) ? false : true

  //Initialise an empty variable to store results of keyValidation
  let validKey

  response.then((data) => {
    //Set the validity of the validKey
    //Use this below for error message population
    if (data.ok) {
      validKey = true
    } else {
      validKey = false
    }
    if (data.ok == true && validPay && validTime) {
      //Construct the preferences object
      let preferences = new Preferences(
        apiKey,
        true,
        pay,
        time,
        getTime(pay, time)
      )

      //Put the preferences object into localstorage
      localStorage.setItem("TIME-preferences", JSON.stringify(preferences))

      //Redirect to the main page
      window.location.replace("./")
    } else {
      if (!validPay) {
        dollarsError.style.display = "block"
      }
      if (!validTime) {
        timeError.style.display = "block"
      }

      if (!validKey) {
        apiError.style.display = "block"
      }
    }
  })
})
