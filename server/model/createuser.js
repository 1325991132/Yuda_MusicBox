var mongoose = require("./db");

const Schema = mongoose.Schema; 

export const FocusSchema = mongoose.model("FocusSchema", new Schema({ 
	username: { type: String }, 
	password: { type: String }, 
	age: { type: Number }, 
	tel: { type: String }, 
	sex: { type: String }, 
	city: { type: String },
    hobby:[]
}),"FocusSchema");

export const Article = mongoose.model("Article",new Schema({
	title:{type:String},
	body:{type:String}
}),"Article");