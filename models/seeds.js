let mongoose = require("mongoose");
let WeightHistory = require("./weightHistory");
let DailyWeight   = require("./dailyWeight");
 
let data = [
    {
        name: "Niudun Wang"
    },
    {
        name: "Desert Mesa"
    },
    {
        name: "Canyon Floor"
    }
];
 
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
            data.forEach(function(seed){
                WeightHistory.create(seed, function(err, history){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a history");
                        //create a comment
                        DailyWeight.create(
                            {
                                date: '2020-9-6',
                                weight: 98
                            }, function(err, dailyweight){
                                if(err){
                                    console.log(err);
                                } else {
                                    history.records.push(dailyweight);
                                    history.save();
                                    console.log("Created a new dailyweight");
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