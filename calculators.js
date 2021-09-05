export function getTime(pay, hours) {
  //Convert dollars to base units (cents)
  const basePay = pay * 100

  //Calculate various rates (hour, minute, second)
  const hourlyRate = basePay / hours
  const minuteRate = hourlyRate / 60
  const secondRate = minuteRate / 60

  //Construct a rate object and return it
  const rateObject = {
    basePay: basePay,
    hourlyRate: hourlyRate,
    minuteRate: minuteRate,
    secondRate: secondRate,
  }
  return rateObject
}

export function timeCost(amount, rateObject) {
  //Convert the dollars to base units (cents)
  const amountBase = amount * 100

  //Calculate the totals of each time type
  const totalHours = amountBase / rateObject.hourlyRate
  const totalMinutes = amountBase / rateObject.minuteRate
  const totalSeconds = amountBase / rateObject.secondRate

  //Calculate the portions of each type
  //The total of all three portions should add up to the total time cost
  //This is used for populating the balances, costs etc
  const hoursPortion = Math.floor(amountBase / rateObject.hourlyRate)
  const minutesPortion =
    ((amountBase % rateObject.hourlyRate) -
      (amountBase % rateObject.minuteRate)) /
    60
  const secondsPortion = Math.floor(amountBase % rateObject.minuteRate)

  //construct and return an amount object
  const amountObject = {
    amount: amount,
    amountBase: amountBase,
    totalHours: totalHours,
    totalMinutes: totalMinutes,
    totalSeconds: totalSeconds,
    hoursPortion: hoursPortion,
    minutesPortion: minutesPortion,
    secondsPortion: secondsPortion,
  }
  return amountObject
}

export default getTime
