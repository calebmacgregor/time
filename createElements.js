export function createTransactionElement(
  timeCostObject,
  descriptionString,
  settledAt
) {
  const transactionTemplate = document.querySelector(".transaction-template")
  const transactionContent = transactionTemplate.content.cloneNode(true)

  const description = transactionContent.querySelector(".description")
  const datetime = transactionContent.querySelector(".datetime")
  const timeSpent = transactionContent.querySelector(".time-spent")

  description.innerText = descriptionString
  datetime.innerText = settledAt
  timeSpent.innerText = `${
    timeCostObject.hoursPortion < 10
      ? "0" + timeCostObject.hoursPortion
      : timeCostObject.hoursPortion
  }h:${
    timeCostObject.minutesPortion < 10
      ? "0" + timeCostObject.minutesPortion
      : timeCostObject.minutesPortion
  }m`

  return transactionContent
}
