export function getTime(pay, hours, expenses) {
	//Convert dollars to base units (cents)
	const basePay = pay * 100
	const baseFunPay = (pay - expenses) * 100

	//Calculate various rates (hour, minute, second)
	const hourlyRate = basePay / hours
	const minuteRate = hourlyRate / 60
	const secondRate = minuteRate / 60

	//Calculate those same rates for baseFunPay
	const hourlyFunRate = baseFunPay / hours
	const minuteFunRate = hourlyFunRate / 60
	const secondFunRate = minuteFunRate / 60

	//Construct a rate object and return it
	const rateObject = {
		basePay: basePay,
		hourlyRate: hourlyRate,
		minuteRate: minuteRate,
		secondRate: secondRate,
		baseFunPay: baseFunPay,
		hourlyFunRate: hourlyFunRate,
		minuteFunRate: minuteFunRate,
		secondFunRate: secondFunRate
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

	//Calculate the fun totals of each time type
	const totalFunHours = amountBase / rateObject.hourlyFunRate
	const totalFunMinutes = amountBase / rateObject.minuteFunRate
	const totalFunSeconds = amountBase / rateObject.secondFunRate

	//Calculate the portions of each type
	//The total of all three portions should add up to the total time cost
	//This is used for populating the balances, costs etc
	const hoursPortion = Math.floor(amountBase / rateObject.hourlyRate)
	const minutesPortion = Math.floor(totalMinutes - hoursPortion * 60)
	const secondsPortion = Math.floor(amountBase % rateObject.minuteRate)

	const hoursFunPortion = Math.floor(amountBase / rateObject.hourlyFunRate)
	const minutesFunPortion = Math.floor(totalFunMinutes - hoursFunPortion * 60)
	const secondsFunPortion = Math.floor(amountBase % rateObject.minuteFunRate)

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
		hoursFunPortion: hoursFunPortion,
		minutesFunPortion: minutesFunPortion,
		secondsFunPortion: secondsFunPortion,
		rateObject: rateObject
	}

	return timeValueObject
}
