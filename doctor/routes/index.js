var express = require('express');
var router = express.Router();
var async = require('async');
var moment = require('moment');
var model_doctor = require('../model/doctor.js')
var model_order = require('../model/order.js')
	/* GET home page. */

//管理员获取所有医生列表
router.get('/AdminGetDoctorlist', function(req, res, next) {
	var page = parseInt(req.query.page) - 1;
	var pageSize = 10;
	model_doctor.Doctor.find({}, {
		"password": 0
	}).skip(page * pageSize).limit(pageSize).exec(function(err, result) {
		res.json({
			"code": 0,
			"data": result
		})
	})
});
//管理员设置医生状态
router.get('/AdminPutDoctor', function(req, res, next) {
	console.log(req.query.model == "status")
	if(req.query.model == "status") {
		model_doctor.Doctor.update({
			"email": req.query.email
		}, {
			"status": req.query.bar
		}, function(err, result) {
			if(result.ok == 1) {
				res.json({
					"code": 0,
					"data": "Update success"
				})
			} else {
				res.json({
					"code": -2,
					"data": "Network error"
				})
			}
		})
	} else {
		model_doctor.Doctor.update({
			"email": req.query.email
		}, {
			"admin": req.query.bar
		}, function(err, result) {
			if(result.ok == 1) {
				res.json({
					"code": 0,
					"data": "Update success"
				})
			} else {
				res.json({
					"code": -2,
					"data": "Network error"
				})
			}
		})
	}

});
//管理员添加医生账户
router.get('/AdminAddDoctor', function(req, res, next) {

	async.waterfall([
			function(cb) {
				model_doctor.Doctor.find({ //查重
					"email": req.query.email
				}, function(err, result) {
					if(result.length != 0) {
						cb(null, 1)
					} else {
						cb(null, 0)
					}
				})
			},
			function(status, cb) {
				if(status == 0) {
					model_doctor.Doctor.create({
						"email": req.query.email,
						"password": "123456",
						"gender": "",
						"name": "default" + req.query.email.substr(0, 3), //默认用户名为default 加邮箱前三位
						"age": 0,
						"telephone": "",
						"clinic": "",
						"link": "",
						"headimg": "http://ofnxiqa6o.bkt.clouddn.com/default.jpg",
						"department": "",
						"specialist": "",
						"introduction": "",
						"avaliabletime": [],
						"appointmenttime": [],
						"createtime": moment().format("YYYY-MM-DD HH:mm:ss"),
						"status": 1,
						"admin": 0
					}, function(err, result) {
						cb(null, {
							"code": 0,
							"data": "Account create success"
						})
					})
				} else {
					cb(null, {
						"code": -2,
						"data": "Account already exists"
					})
				}
			}
		],
		function(err, result) {
			console.log(result)
			res.json(result);
		});
});

router.get('/AdmindeletDoctor', function(req, res, next) {
	model_doctor.Doctor.remove({ //查重
		"email": req.query.email,
		"admin": 0
	}, function(err, result) {
		if(result.result.n==1) {
			res.json({
				"code": 0,
				"data": "Delete success"
			})
		} else {
			res.json({
				"code": -2,
				"data": "Permission deny: can not delete management"
			})
		}
	})

})

router.get('/AdminsearchDoctor', function(req, res, next) {
	model_doctor.Doctor.find({ //查重
		"$or": 
			[ 
				{"email":{"$in":[req.query.keyword]}}, 
				{"name":req.query.keyword} 
			] 
	}, function(err, result) {
		console.log(result)
		if(result.length!=0) {
			res.json({
				"code": 0,
				"data": result
			})
		} else {
			res.json({
				"code": -2,
				"data": "Permission deny: can not locate the doctor"
			})
		}
	})

})


//注册
router.post('/register', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	async.waterfall([
			function(cb) {
				model_doctor.Doctor.find({ //查重
					"email": email
				}, function(err, result) {
					if(result.length != 0) {
						cb(null, 1)
					} else {
						cb(null, 0)
					}
				})
			},
			function(status, cb) {
				if(status == 0) {
					model_doctor.Doctor.create({
						"email": email,
						"password": password,
						"gender": "",
						"name": "",
						"age": 0,
						"telephone": "",
						"clinic": "",
						"link": "",
						"headimg": "http://ofnxiqa6o.bkt.clouddn.com/default.jpg",
						"department": "",
						"specialist": "",
						"introduction": "",
						"avaliabletime": [],
						"appointmenttime": [],
						"createtime": moment().format("YYYY-MM-DD HH:mm:ss"),
						"status": 1,
						"admin": 0
					}, function(err, result) {
						if(result) {
							cb(null, {
								"code": 0,
								"data": "Register success"
							})
						} else {
							cb(null, {
								"code": -2,
								"data": "Network error"
							})
						}
					})
				} else {
					cb(null, {
						"code": -2,
						"data": "Account already exists"
					})
				}
			}
		],
		function(err, result) {
			console.log(result)
			res.json(result);
		});
});

//登录
router.post('/login', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	model_doctor.Doctor.find({
		"email": email,
		"password": password
	}, {
		"password": 0
	}, function(err, result) {
		if(result.length != 0) {
			if(result[0].status == 1) {
				res.json({
					"code": 0,
					"data": result[0]
				})
			} else {
				res.json({
					"code": -2,
					"data": "Permission deny: in-active user"
				})
			}
		} else {
			res.json({
				"code": -2,
				"data": "Account or password error"
			})
		}
	})
});

//重置密码
router.post('/modifypassword', function(req, res, next) {
	var email = req.body.email;
	var oldpassword = req.body.oldpassword;
	var newpassword = req.body.newpassword;

	async.waterfall([
			function(cb) {
				model_doctor.Doctor.find({ //验证密码是否正确
					"email": email,
					"password": oldpassword
				}, function(err, result) {
					if(result.length != 0) {
						cb(null, 1)
					} else {
						cb(null, 0)
					}
				})
			},
			function(status, cb) {
				if(status == 1) {
					model_doctor.Doctor.update({
						"email": email
					}, {
						"password": newpassword
					}, function(err, result) {
						if(result.ok == 1) {
							cb(null, {
								"code": 0,
								"data": "Update success"
							})
						} else {
							cb(null, {
								"code": -2,
								"data": "Network error"
							})
						}
					})
				} else {
					cb(null, {
						"code": -2,
						"data": "Account or password error"
					})
				}
			}
		],
		function(err, result) {
			console.log(result)
			res.json(result);
		});
});

//设置个人信息
router.post('/selfinfo', function(req, res, next) {
	var email = req.body.email;
	var condition = {};
	!!req.body.gender ? condition.gender = req.body.gender : void 0;
	!!req.body.age ? condition.age = req.body.age : void 0;
	!!req.body.telephone ? condition["telephone"] = req.body.telephone : void 0;
	!!req.body.clinic ? condition.clinic = req.body.clinic : void 0;
	!!req.body.department ? condition.department = req.body.department : void 0;
	!!req.body.name ? condition.name = req.body.name : void 0;
	!!req.body.specialist ? condition.specialist = req.body.specialist : void 0;
	!!req.body.introduction ? condition.introduction = req.body.introduction : void 0;
	!!req.body.link ? condition.link = req.body.link : void 0;
	!!req.body.headimg ? condition.headimg = req.body.headimg : void 0;

	model_doctor.Doctor.update({
		"email": email
	}, condition, function(err, result) {
		if(result.ok == 1) {
			res.json({
				"code": 0,
				"data": "Update success"
			})
		} else {
			res.json({
				"code": -2,
				"data": "Network error"
			})
		}
	})
});
router.get('/getinfo', function(req, res, next) {

	model_doctor.Doctor.find({
		"email": req.query.email
	}, {
		password: 0
	}, function(err, result) {
		if(result.length != 0) {
			res.json({
				"code": 0,
				"data": result[0]
			})
		} else {
			res.json({
				"code": -2,
				"data": "Network error"
			})
		}
	})
})

//医生列表
router.get('/doctorlist', function(req, res, next) {
	model_doctor.Doctor.find({
		"status": 1
	}, function(err, result) {
		if(result) {
			res.json({
				"code": 0,
				"data": result
			})
		} else {
			res.json({
				"code": -2,
				"data": "Network error"
			})
		}
	})
});

//病人预约医生
router.post('/appointment', function(req, res, next) {
	var createdate = new Date();
	var email = req.body.email;
	var name = req.body.name;
	var gender = req.body.gender;
	var age = req.body.age;
	var phone = req.body.phone;
	var description = req.body.description;
	var doctorid = req.body.doctorid;
	var scheduletime = req.body.scheduletime;
	if(!email || !name || !gender || !age || !phone || !doctorid || !scheduletime) {
		res.json({
			"code": -2,
			"data": "Information incomplete"
		})
	} else {
		async.waterfall([
				function(cb) {
					model_doctor.Doctor.find({ //验证医生是否存在
						"_id": doctorid
					}, {
						password: 0,
						_id: 0,
						appointmenttime: 0,
						avaliabletime: 0
					}, function(err, result) {
						if(result.length != 0) {
							cb(null, 1, result[0])
						} else {
							cb(null, 0, null)
						}
					})
				},
				function(status, doctorinfo, cb) {
					if(status == 1) {
						model_order.Order.create({
							"email": email,
							"name": name,
							"age": age,
							"phone": phone,
							"gender": gender,
							"description": description,
							"doctorinfo": doctorinfo,
							"scheduletime": scheduletime,
							"createdate": createdate
						}, function(err, result) {
							if(result) {
								cb(null, 1, doctorinfo)
							} else {
								cb(null, 0, null)
							}
						})
					} else {
						cb(null, 0, null)
					}
				},
				function(status, doctorinfo, cb) {
					if(status == 1) {
						model_doctor.Doctor.update({
							"email": doctorinfo.email
						}, {
							$addToSet: {
								appointmenttime: {
									"id": scheduletime,
									"title": "Customer:" + name + "  Email:" + email,
									"start": scheduletime,
									"end": scheduletime + 3600000,
									"backgroundColor": "red",
									"type": 1
								}
							}
						}, function(err, result) {
							if(result.ok == 1) {
								model_doctor.Doctor.update({
										"email": doctorinfo.email
									}, {
										$pull: {
											avaliabletime: {
												"id": scheduletime,
												"title": 'Avaliable',
												"start": scheduletime,
												"end": scheduletime + 3600000,
												"backgroundColor": "green",
												"type": 0
											}
										}
									},
									function(err, result) {
										cb(null, {
											"code": 0,
											"data": "Booking success"
										})
									})
							} else {
								cb(null, {
									"code": -2,
									"data": "Booking failed"
								})
							}
						})
					} else {
						cb(null, {
							"code": -2,
							"data": "Booking failed"
						})
					}
				}
			],
			function(err, result) {
				console.log(result)
				res.json(result);
			});
	}
});

//病人就诊历史
router.get('/visithistory', function(req, res, next) {
	var email = req.query.email;
	model_order.Order.find({ // 查询病人就诊记录
		"email": email
	}, function(err, result) {
		if(result.length != 0) {
			res.json({
				"code": 0,
				"data": result
			})
		} else {
			res.json({
				"code": -2,
				"data": "No record"
			})
		}
	})
});

//医生添加avaliable时间
router.post('/setresttime', function(req, res, next) {
	var email = req.body.email;
	var avaliabletime = req.body.avaliabletime;

	model_doctor.Doctor.update({
		"email": email
	}, {
		$addToSet: {
			avaliabletime: {
				"id": avaliabletime,
				"title": 'Avaliable',
				"start": avaliabletime,
				"end": avaliabletime + 3600000,
				"backgroundColor": "green",
				"type": 0
			}
		}
	}, function(err, result) {
		if(result.ok == 1) {
			res.json({
				"code": 0,
				"data": "Success"
			})
		} else {
			res.json({
				"code": -2,
				"data": "No record"
			})
		}
	})
});

//医生删除avaliable时间
router.post('/delresttime', function(req, res, next) {
	var email = req.body.email;
	var avaliabletime = req.body.avaliabletime;

	model_doctor.Doctor.update({
		"email": email
	}, {
		$pull: {
			avaliabletime: {
				"id": avaliabletime,
				"title": 'Avaliable',
				"start": avaliabletime,
				"end": avaliabletime + 3600000,
				"backgroundColor": "green",
				"type": 0
			}
		}
	}, function(err, result) {
		if(result.ok == 1) {
			res.json({
				"code": 0,
				"data": result
			})
		} else {
			res.json({
				"code": -2,
				"data": result
			})
		}
	})
});

//医生获取今日预约列表
router.get('/TodayAppointmentList', function(req, res, next) {
	var email = req.query.email;
	var time_now = new Date();
	var time = moment(time_now).format("YYYY-MM-DD 00:00:00");
	var timestamp_start = Date.parse(time);
	var timestamp_end = timestamp_start + 86400000
	console.log(timestamp_start);
	console.log(timestamp_end);

	model_order.Order.find({ // 查询病人就诊记录
		"doctorinfo.email": email,
		"scheduletime": {
			"$gte": timestamp_start,
			"$lte": timestamp_end
		}
	}, {
		doctorinfo: 0
	}, function(err, result) {
		if(result.length != 0) {
			res.json({
				"code": 0,
				"data": result
			})
		} else {
			res.json({
				"code": -2,
				"data": "No event today"
			})
		}
	})
});
//医生获取所有预约列表
router.get('/AllAppointmentList', function(req, res, next) {
	var email = req.query.email;
	model_order.Order.find({ // 查询病人就诊记录
		"doctorinfo.email": email
	}, {
		doctorinfo: 0
	}, function(err, result) {
		if(result.length != 0) {
			res.json({
				"code": 0,
				"data": result
			})
		} else {
			res.json({
				"code": -2,
				"data": "No records"
			})
		}
	})
});
//医生获取所有日历安排
router.get('/AllDateList', function(req, res, next) {
	var email = req.query.email;
	model_doctor.Doctor.find({ // 查询病人就诊记录
		"email": email
	}, {
		avaliabletime: 1,
		appointmenttime: 1
	}, function(err, result) {
		if(result.length != 0) {
			res.json({
				"code": 0,
				"data": result
			})
		} else {
			res.json({
				"code": -2,
				"data": "No records"
			})
		}
	})
});

module.exports = router;