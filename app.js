const express = require("express");
const ejs = require("ejs");

const app = express();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({
    extended: false
}));
app.use(express.static('public'));

app.listen(8080);

let viewPath = __dirname + "/views/";

const Patient = require('./model/ptModel');
const Doctor = require('./model/docModel');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/clinic', function (err) { //serverAddress:port//dbName
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
});

const moment = require('moment'); //MomentJS JavaScript library helps displaying time /date in JS

app.get('/', function (req, res) {
    res.sendFile(viewPath + "homepage.html");
});

app.get('/addDoc', function (req, res) {
    res.sendFile(viewPath + "newDoc.html");
});

app.get('/addPt', function (req, res) {
    res.sendFile(viewPath + "newPt.html");
})

app.get('/invalid', function (req, res) {
    res.sendFile(viewPath + "invalidData.html");
});

app.get('/allDoc', function (req, res) {
    Doctor.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("allDoc", {
                docs: data,
                moment: moment
            });
        }
    });
});

app.get('/allPt', function (req, res) {
    Patient.find().populate('doctor').exec(function (err, data) { //reference documents in other collections
        if (err) {
            console.log(err);
        } else {
            res.render("allPt", {
                pts: data,
                moment: moment
            });
        }
    });
});

app.get('/updateDoc', function (req, res) {
    res.sendFile(viewPath + "updateDoc.html");
});

app.get('/deletePt', function (req, res) {
    res.sendFile(viewPath + "deletePt.html");
});

app.get('/deleteDoc', function (req, res) {
    res.sendFile(viewPath + "deleteDoc.html");
});

app.post('/addDocInfo', function (req, res) {
    let newDoc = new Doctor({
        fullName: {
            firstName: req.body.docFirst,
            lastName: req.body.docLast
        },
        dateOfBirth: req.body.dob,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        },
        numPatients: req.body.ptNumber
    });

    newDoc.save(function (err) {
        if (err) {
            res.redirect('/invalid');
        } else {
            res.redirect('/allDoc');
            console.log(req.body);
        }
    });
});


app.post('/addPtInfo', function (req, res) {
    let newPt = new Patient({
        fullName: req.body.fullName,
        doctor: req.body.doc,
        age: req.body.age,
        dateVisit: req.body.date,
        case: req.body.case
    });

    newPt.save(function (err) {
        if (err) {
            res.redirect('/invalid');
        } else {
            res.redirect('/allPt');
            Doctor.updateOne({
                "_id": mongoose.Types.ObjectId(req.body.doc)
            }, {
                $inc: {
                    "numPatients": 1
                }
            }, function (err, doc) {
                console.log(doc);
            });
        }
    });
});


app.post('/deletePtInfo', function (req, res) {
    Patient.deleteOne({
        fullName: req.body.fullName
    }, function (err, doc) {
        console.log(req.body);
        res.redirect('/allPt');
    });
});

app.post("/updateDocInfo", function (req, res) {
    if (req.body.newNumber >= 0) {
        Doctor.updateOne({
            "_id": mongoose.Types.ObjectId(req.body.docID)
        }, {
            $set: {
                "numPatients": req.body.newNumber
            }
        }, function (err, doc) {
            res.redirect('/allDoc');
        });
    }else{
        res.redirect('/invalid')
    }
});

app.post("/deleteDocPt", function (req, res) {
    Doctor.deleteOne({
        "_id": mongoose.Types.ObjectId(req.body.docID)
    }, function (err, doc) {
        res.redirect("/allDoc");
    });
    Patient.deleteMany({
        doctor: mongoose.Types.ObjectId(req.body.docID)
    }, function (err, doc) {
        console.log("patients deleted successfully");
    });
});