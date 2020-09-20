let mongoose = require("mongoose");
let moment = require("moment");
let WeightHistory = require("./weightHistory");
let DailyWeight   = require("./dailyWeight");
 
const data = [
    {
        name: "Niudun Wang"
    }
];

const dws = generateTestData('2020-06-02', 180, 180);

//returns an array of strings that represents dates, bounded from above by size 
function generateTestData(start, span, size){
    let testDates = new Set();
    for(i=0; i<size; i++)
    	testDates.add(randomDate(start, span));
    let testDatesArray = Array.from(testDates);
    
    let testData = [];
    for(i=0; i<testDatesArray.length; i++)
    	testData.push({date: testDatesArray[i], weight: getRandomInt(90)});
    return testData;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/*randomly picks a date between start and start+span, note here start and end*/
function randomDate(start, span){
    return moment(start, 'YYYY/MM/DD').add(getRandomInt(span), 'day').format('YYYY/MM/DD');
}
 
function seedDB(){
   //Remove all campgrounds
   WeightHistory.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed all weightHistory!");
        DailyWeight.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed all weights!");
             //add a few campgrounds
            data.forEach(async function(seed){
                WeightHistory.create(seed, function(err, history){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a history");
						DailyWeight.create(dws , function(err, dailyweights){
							if(err){
							console.log(err);
							} else {
							dailyweights.forEach(function(dw){
								history.records.push(dw);
							});
								history.save();
							console.log("Created new dailyweights");
							}
							});
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;