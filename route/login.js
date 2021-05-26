const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/home', function(req, res, next){
    return res.render('home.ejs')
})

router.post('/home', function(req, res, next){
    var personInfo = req.body

    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
        res.send()
    }
    else{
        if (personInfo.password == personInfo.passwordConf){
            User.findOne({email:personInfo.email}, function(err,data){
                if (!data){
                    var c
                    User.findOne({}, function(err, data){
                        if (data) {
                            c = data.unique_id + 1
                        }
                        else{
                            c = 1
                        }
                        var newPerson = new User({
                            unique_id:c,
                            email:personInfo.email,
                            username:personInfo.username,
                        })
                        newPerson.password = newPerson.generateHash(personInfo.password)
                        newPerson.save()
                    }).sort({_id: -1}).limit(1)
                    res.send({"Success":"Registered. Login now"})
                }
                else {
                    res.send({"Success":"Email already in use"})
                }
            })
        }
        else {
            res.send({"Success":"Password does not match"})
        }
    }
})

router.get('/login', function(req, res, next){
    return res.render('login.ejs')
})

router.post('/login', function(req, res, next) {
    User.findOne({email:req.body.email}, function(err,data){
        if(data){
            if (data.validPassword(req.body.password)){
                req.session.userId = data.unique_id
                res.send({"Success":"Success"})
            }
            else{
                res.send({"Success":"Wrong password"})
            }
        }
        else {
            res.send({"Success":"Email not registered"})
        }
    })
})

module.exports = router