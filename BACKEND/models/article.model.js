import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const articleSchema = mongoose.Schema({

        name : String,
        content: String,
        category : String,
        brand : String,
        price : Number,

        avis: {
          stars :{type :Number, required : false},
          nb: {type :Number, required : false}
        },
        picture : [{
          img :String, 
          img1:{type :String, required : false},
          img2:{type :String, required : false},
          img3:{type :String, required : false},
          img4:{type :String, required : false},
        }] ,
        status: Boolean,
        stock : Number,

})


export default mongoose.model("Articles", articleSchema);