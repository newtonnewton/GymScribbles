let infoSchema = new mongoose.Schema({
	name: String,
	dates: [String],
	figures: [Number]
});
let Entry = mongoose.model("Entry", infoSchema);
Entry.create({
	name: 'Niudun',
	dates: ['Sep-1', 'Sep-5', 'Sep-9', 'Sep-13', 'Sep-17'],
	figures: [80, 83, 85, 90, 91]
});

//show the plot
app.get("/plot", function(req, res){	
	Entry.findOne({name: 'Niudun'}, function(err, entries){
		if(err)
			console.log("error");
		else res.render("plot", {entries: entries});
	});
});

//update the plot
app.post("/plot", function(req, res){
	const name = {name: 'Niudun'};
	const figure = req.body.entry.figure;
	const date = req.body.entry.date;
	console.log("figure:" + figure);
	console.log("date: " + date);
	Entry.updateOne(name, {$push: {figures: [figure], dates: [date]}}, function(err, raw){
		if(err)
			console.log("error");
		else res.redirect("/plot");
	});
});
