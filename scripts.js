import { getTime, timeCost } from "./calculators.js"

const rateObject = getTime(2880, 80)
const expenseItem = timeCost(5, rateObject)
const token =
  "up:yeah:NULvDQe7lrgiG9eMgnbP62XrsuUUw2LDkQjN4J3hvFM5w0uTUQnBXtAT8pyjXu6hHk8cduezjrccrgKdRPutlTOX35qdlGJwXZsZCHGYQnAURAbhYSd15buR6v6eAWQr"

console.log(
  `That $${expenseItem.amount} item cost you ${expenseItem.hoursPortion} hours, ${expenseItem.minutesPortion} minutes and ${expenseItem.secondsPortion} seconds of your life`
)

let pingURL = "https://api.up.com.au/api/v1/util/ping"
let accountsURL = "https://api.up.com.au/api/v1/accounts"

// fetch(accountsURL, {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// })
//   .then((res) => res.json())
//   .then((json) => console.log(json))

async function getAccounts(url, token) {
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  let data = await response.json()
  return data
}

let accounts = getAccounts(accountsURL, token)

accounts.then((data) => {
  data.data.forEach((item) => {
    console.log(item)
    console.log(item.attributes.balance.value)

    let expenseItem = timeCost(item.attributes.balance.value, rateObject)
    console.log(
      `This account (with $${expenseItem.amount} in it) is worth ${expenseItem.hoursPortion} hours, ${expenseItem.minutesPortion} minutes and ${expenseItem.secondsPortion} seconds`
    )
  })
})
