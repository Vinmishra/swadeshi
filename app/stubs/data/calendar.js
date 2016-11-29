	let createSpecialDates = function(consumptionStart, consumptionEnd, changeConsumptionStart, changeConsumptionEnd) {
	    let specialDates = [];
	    for (let randomIndex = 0; randomIndex < 5; randomIndex++) {
	        let randomDate = new Date(consumptionStart.getTime() + Math.random() * (consumptionEnd.getTime() - consumptionStart.getTime()));
	        specialDates.push({
	            date: randomDate,
	            isConsumed: true,
	            quantity: '2 ltr'
	        });
	    }
	    for (let extraIndex = 0; extraIndex < 5; extraIndex++) {
	        let randomDate = new Date(changeConsumptionStart.getTime() + Math.random() * (changeConsumptionEnd.getTime() - changeConsumptionStart.getTime()));
	        specialDates.push({
	            date: randomDate,
	            isConsumptionChanged: true,
	            quantity: '3 ltr'
	        });
	    }

	    return specialDates;
	};

	let params = {
	    'dateFormat': 'dd-mm-yy',
	    'min': '01-11-2016',
	    'max': '30-11-2016',
	    'isInline': true,
	    'enableWeekend': false,
	    'specialDates': createSpecialDates(new Date(2016, 10, 1), new Date(2016, 10, 15), new Date(2016, 10, 16), new Date(2016, 10, 30))
	};
	export default params;