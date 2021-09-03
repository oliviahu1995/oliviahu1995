const mongoose= require("mongoose");

const ptSchema=mongoose.Schema({
    fullName: {
        type: String,
        validate: {
            validator: function(newFullName){
                return newFullName.length>0;
            },
            message: 'full name cannot be empty'
        }
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor' //model name
    },
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    dateVisit: {
        type: Date,
        default: Date.now
    },
    case: {
        type: String,
        minlength: 10
    }
});

module.exports=mongoose.model('Patient',ptSchema);