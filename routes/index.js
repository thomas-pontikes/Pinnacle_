var express = require('express');
var router = express.Router();
var config = require('../config/config');
var Horseman = require('node-horseman');

var student = {};
var credentials = {};

router.get('/', function(req, res, next){
res.render('index',{title:"Ticket"})

});

router.post("*", function(req, res, next){

student = {
	hd_employee:req.body.username,
	option:"",
	option_int: option_int,
	message:"",
		User:{
			id: req.body.id,
			name: "",
			ecampus_username: "",
			ticket: ""
		}
}

credentials = {
	username:req.body.username,
	password:req.body.password
}



	var option_int = parseInt(req.body.option)

	if(option_int >= 1942 && option_int <= 1949){
		student.option = "wifi";
	}

	if(option_int === 1783){
		student.option = "ecampus";
	}

	if(option_int === 1835){
		student.option = "email";
	}

	student.option_int = option_int;


next();

});

router.post('/doTicket', function(req, res, next) {

	doTicket(function(data){
		credentials = {}
		res.json(data);
	})

});

router.post('/checkData', function(req, res, next) {

	checkUser(function(data){
		credentials = {};
		res.json(data);
	})

});


function checkUser(callback){
var horseman = new Horseman();

student.option="User Query";
student.User.ticket="User Query: No Ticket Created"

	horseman
	.viewport(3200,1800)
	.open("http://pinnacle.uri.edu:7777/pls/pinnacle/f?p=1102:800:109212746083472::NO::CURRENT_TAB_ID,ROLE_ID:546,23:NO")
	.type('input[id="P1_USERNAME"]', credentials.username)
	.type('input[id="P1_PASSWORD"]', credentials.password)
	.click('#B50388414731896248')
	.waitForNextPage()
	.exists('[data-pinn-message-id="17000018"]')
	.then(function(isFalse){
		if(isFalse){
		callback({"Error":"Username or Password is incorrect, please try again."})
		return horseman.close();
		}

	})
	.type('input[id="P800_USER_DEFINED_ID_Q"]',student.User.id)
	.click('#B7445903353404766')
	.waitForNextPage()
    .count("#R64163813204487568 .pinn-ui-report-body tbody tr")
    .then(function(numLinks){
	  if(numLinks > 2 || numLinks === 0){
      callback({"Error":"A unique user was not found, please try again"})
      return horseman.close();
    }
    })
	.click('td[headers="SUBSCRIBER_ID"] a')
	.waitForNextPage()	
	.text('#P803_FORM_DISPLAY_NAME_DISPLAY')
	.then(function(name){
		student.User.name = name
	})
	.text('#P803_ADD_INFO_TEXT_1')
	.then(function(ecampus){
		student.message = "Please Verify the Student's Information"
		student.User.ecampus_username = ecampus
		callback(student)
		return horseman.close()
	});
}




function doTicket(callback){
var horseman = new Horseman();

	horseman
    .viewport(3200,1800)
	.open("http://pinnacle.uri.edu:7777/pls/pinnacle/f?p=1102:800:109212746083472::NO::CURRENT_TAB_ID,ROLE_ID:546,23:NO")
	.type('input[id="P1_USERNAME"]', credentials.username)
	.type('input[id="P1_PASSWORD"]', credentials.password)
	.click('#B50388414731896248')
	.waitForNextPage()
	.exists('[data-pinn-message-id="17000018"]')
	.then(function(isFalse){
		if(isFalse){
		callback({"Error":"Username or Password is incorrect, please try again."})
		return horseman.close();
		}

	})
	.type('input[id="P800_USER_DEFINED_ID_Q"]',student.User.id)
	.click('#B7445903353404766')
	.waitForNextPage()
    .count("#R64163813204487568 .pinn-ui-report-body tbody tr")
    .then(function(numLinks){
	  if(numLinks > 2 || numLinks === 0){
      callback({"message":"A unique user was not found, please try again"})
      return horseman.close();
    }
    })
	.click('td[headers="SUBSCRIBER_ID"] a')
	.waitForNextPage()	
	.text('#P803_FORM_DISPLAY_NAME_DISPLAY')
	.then(function(name){
		student.User.name = name
	})
	.text('#P803_ADD_INFO_TEXT_1')
	.then(function(ecampus){
		student.User.ecampus_username = ecampus
	})
	.switchToFocusedFrame()
	.click('#B683561207302446098')
	.wait(2000)
	.switchToFocusedFrame()
	.select('select[name="p_t13"]', student.option_int)
	.value('textarea[name="p_t14"]', config[student.option].message)
	.screenshot("test.png")
	.click('#B7647613816501498')
	.wait(4000)
	.switchToFocusedFrame()
	.html('#P5508_ORDER_MESSAGE')
	.then(function(ticket){
		student.message ="Ticket Complete";
		student.User.ticket = ticket;
		callback(student)
		return horseman.close()
	});

}




module.exports = router;

