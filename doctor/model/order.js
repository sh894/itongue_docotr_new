var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var orderSchema = new Schema({
 email: String,
 gender: String,
 age:Number,
 name:String,
 phone:String,
 doctorinfo:Object,
 description:String,
 scheduletime:Number,
 createdate:Date
},{
	versionKey: false
});

exports.Order = mongoose.model('order', orderSchema, 'order');

