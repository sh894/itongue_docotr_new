var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var doctorSchema = new Schema({
 email: String,
 password: String,
 gender: String,
 age:Number,
 name:String,
 link:String,
 telephone:String,
 clinic:String,
 department:String,
 specialist:String,
 introduction:String,
 avaliabletime:Array,
 headimg:String,
 appointmenttime:Array
},{
	versionKey: false
});

exports.Doctor = mongoose.model('doctor', doctorSchema, 'doctor');

