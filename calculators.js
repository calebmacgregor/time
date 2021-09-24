export function getTime(pay, hours, expenses, daysPerPay = 14) {
  //Convert dollars to base units (cents)
  const basePay = pay * 100
  const baseNetPay = (pay - expenses) * 100
  const baseExpenses = expenses * 100

  //Calculate various rates (hour, minute, second)
  const hourlyRate = basePay / hours
  const minuteRate = hourlyRate / 60
  const secondRate = minuteRate / 60

  //Calculate those same rates for baseNetPay
  const dailySurvivalRate = baseExpenses / daysPerPay
  const hourlySurvivalRate = dailySurvivalRate / 24
  const minuteSurvivalRate = hourlySurvivalRate / 60
  const secondSurvivalRate = minuteSurvivalRate / 60

  //Construct a rate object and return it
  const rateObject = {
    basePay: basePay,
    hourlyRate: hourlyRate,
    minuteRate: minuteRate,
    secondRate: secondRate,
    dailySurvivalRate: dailySurvivalRate,
    hourlySurvivalRate: hourlySurvivalRate,
    minuteSurvivalRate: minuteSurvivalRate,
    secondSurvivalRate: secondSurvivalRate,
  }

  return rateObject
}

//Return an object that shows the time cost of an item.
//Requires a rateObject generated using getTime
export function timeValue(amount, rateObject) {
  //Convert the dollars to base units (cents)
  const amountBase = amount * 100

  //Calculate the totals of each time type
  const totalHours = amountBase / rateObject.hourlyRate
  const totalMinutes = amountBase / rateObject.minuteRate
  const totalSeconds = amountBase / rateObject.secondRate

  //Calculate the survival totals of each time type
  const totalSurvivalHours = amountBase / rateObject.hourlySurvivalRate
  const totalSurvivalMinutes = amountBase / rateObject.minuteSurvivalRate
  const totalSurvivorSeconds = amountBase / rateObject.secondSurvivalRate

  //Calculate the portions of each type
  //The total of all three portions should add up to the total time cost
  //This is used for populating the balances, costs etc
  const hoursPortion = Math.floor(amountBase / rateObject.hourlyRate)
  const minutesPortion = Math.floor(totalMinutes - hoursPortion * 60)
  const secondsPortion = Math.floor(amountBase % rateObject.minuteRate)

  const survivalDailyPortion = Math.floor(
    amountBase / rateObject.dailySurvivalRate
  )
  const survivalHoursPortion = Math.floor(
    (amountBase - survivalDailyPortion * rateObject.dailySurvivalRate) /
      rateObject.hourlySurvivalRate
  )

  const survivalMinutesPortion = Math.floor(
    (amountBase -
      (survivalHoursPortion * rateObject.hourlySurvivalRate +
        survivalDailyPortion * rateObject.dailySurvivalRate)) /
      rateObject.minuteSurvivalRate
  )

  // const survivalHoursPortion = Math.floor(
  //   amountBase / rateObject.hourlySurvivalRate
  // )
  // const survivalMinutesPortion = Math.floor(
  //   totalSurvivalMinutes - survivalHoursPortion * 60
  // )
  // const survivalSecondsPortion = Math.floor(
  //   amountBase % rateObject.minuteSurvivalRate
  // )

  //construct and return a timeValueObject
  const timeValueObject = {
    amount: amount,
    amountBase: amountBase,
    totalHours: totalHours,
    totalMinutes: totalMinutes,
    totalSeconds: totalSeconds,
    hoursPortion: hoursPortion,
    minutesPortion: minutesPortion,
    secondsPortion: secondsPortion,
    survivalDailyPortion: survivalDailyPortion,
    survivalHoursPortion: survivalHoursPortion,
    survivalMinutesPortion: survivalMinutesPortion,
    // survivalSecondsPortion: survivalSecondsPortion,
    rateObject: rateObject,
  }

  return timeValueObject
}
