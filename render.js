export //Construct and populate each transaction from the API call
async function renderTransactions(pingUpData) {
  let data = await pingUpData

  data.data.forEach((item) => {
    //Get the timeValue of each transaction
    let timeValueObject = timeValue(
      Math.abs(item.attributes.amount.value),
      rateObject
    )

    //Convert the settledTime value to a date
    const settledTime = item.attributes.settledAt
      ? new Date(item.attributes.settledAt)
      : new Date(item.attributes.createdAt)

    //Create the transaction element
    let elt = createTransactionElement(
      timeValueObject,
      item.attributes.description,
      `${settledTime.toLocaleString("en-AU", {
        month: "short",
        day: "numeric",
      })}, ${settledTime.toLocaleTimeString("en-AU", {
        timeStyle: "short",
      })}`
    )
    //Set the id to be the same as the transaction id from the API
    elt.id = item.id

    //Append the transaction element to List
    list.appendChild(elt)
  })
}
