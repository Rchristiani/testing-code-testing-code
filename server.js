const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const assert = require('chai').assert;
const fs = require('fs');

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Content-length, Accept, x-access-token');
	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
	next();
}); 



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/test', (req,res) => { 
	const usersAnswer = req.body.answer;
	//Create a module for the test.
	fs.writeFile('./tests/first.js',`
		let add;
		${usersAnswer}
		module.exports = {
			add : add
		};
	`, (err) => {
		//Require the module
		const testFile = require('./tests/first.js');
		try {
			//Check it
			assert(testFile.add(2,3) === 5);
			res.send({test:'passed'});
		}
		catch (e){
			res.send({test:'failed'});	
		}
	});
});

app.listen('3600');