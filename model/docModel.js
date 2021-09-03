const mongoose=require("mongoose");

const docSchema=mongoose.Schema({
    fullName: {
        firstName:{
            type: String,
            validate: {
                validator: function(newFirstName){
                    return newFirstName.length>0;
                },
                message: 'first name cannot be empty'
            }
        },
        lastName: String
    },
    dateOfBirth: Date,
    address:{
        state: {
            type: String,
            minlength: 2,
            maxlength: 3,
        },
        suburb: String,
        street: String,
        unit: Number
    },
    numPatients: {
        type: Number,
        min: 0
    }
});

module.exports=mongoose.model('Doctor',docSchema); //model name, schema name