let mongoose = require("mongoose");
let WeightHistory = require("./weightHistory");
let DailyWeight   = require("./dailyWeight");
 
const data = [
    {
        name: "Niudun Wang"
    }
];

const dws = [{date: '2020-8-7', weight: 87},{date: '2020-9-6', weight: 93}, {date: '2020-9-12', weight: 99}];
 
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