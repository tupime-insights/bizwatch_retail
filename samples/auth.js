
var express = require('express'),
     url = require('url'),
     bcrypt  = require('bcrypt'),
     //cloudinary = require('cloudinary'),
     utils = require('./utilities'),
     //config = require('../config').CLOUDINARY,
     router = express.Router();


const saltRounds = 10;

//configure the cloudinary options.
 /*cloudinary.config({
   cloud_name: config.cloud_name,
   api_key: config.api_key,
   api_secret: config.api_secret
 })*/


router.post('/signup', function(req,res,next){
  var  username = req.body.username, //has become business name
       pass = req.body.password,
       email =  req.body.user_email,
       businessCode = utils.generateRandomString()


     dbPool.getConnection(function(err,conn){
        if (err) {
           return next(err)
        }

        //first check if the business email  is already registered.
        var sql1 =  "SELECT * FROM users WHERE user_email = ?"; //and email should not be same
         conn.query(sql1,[email], function(err,results){
            if (err) {
              return next(err)
            }

            if (results.length > 0) {
                return res.status(400).send({"success": false, "message": 'Business email  already exists'})
            } else {
               
               bcrypt.hash(pass,saltRounds, function(err, hashedPassword){
                  if (err) {
                     console.log('failed to hash the password try again', err)
                  }
                 
                  var userDetails = {
                     user_name: username,
                     user_pass: hashedPassword,
                     user_email:email,
                     biz_code: businessCode,
                     created_on: new Date()
                  }

                  //what about creating a business profile for the first signup
                  conn.query('INSERT INTO users SET ?', userDetails, function(err,results){
                     if (err) {
                         return next(err)
                     }
                     if (results.insertId) {
                        const newBusiness = {
                           biz_name: userDetails.user_name,
                           biz_code: businessCode,
                           biz_email: userDetails.user_email,
                           biz_owner:results.insertId,
                           created_on: new Date()  
                        },
                        business_sql = 'INSERT INTO business SET ?';
                          
                           conn.query(business_sql,newBusiness, function(err,bizResult){
                              conn.release()
                              if (err) {
                                 return next(err)
                              }
                              if (bizResult.insertId) {
                                 return res.status(201).send({"success": true, "message": 'successful registered user and business'})
                              }
                           })

                     } else {
                          return res.status(400).send({"success": false, "message": 'Failed registration'})
                     }
                  })
               })
             }
         })


     })

})





// LOGIN API.
router.post('/login', function(req,res,next){

      if (!req.body) {
        return res.status(404).send({"success": false, "message": 'No user credentials provided'})
      }
      var email = req.body.email,
          password = req.body.password;
        
         dbPool.getConnection(function(err,conn){
             if (err) {
                return next(err)
             }
              var sql1 = "SELECT * FROM  users WHERE user_email = ?"
              conn.query(sql1, [email], function(err,results){
                 conn.release()
                 if (err) {
                    return next(err)
                 }
                 if (results.length > 0) {
                     let resultUser = results[0]
                     
                    //then  go ahead and compare teh pasword supplied vs hashed password
                    bcrypt.compare(password, resultUser.user_pass, function(err,doesMatch){
                       if (err) {
                         return next(err)
                       }
                        
                       if (doesMatch === true) {
                            var token = utils.createToken(resultUser.user_email)
                            if (token) {
                                 res.status(200).send({"success": true,
                                    "message": {
                                       username: resultUser.user_name,
                                       token: token,
                                       bizId:resultUser.biz_code
                                    }
                                  })
                            } else {
                               res.status(400).send({"success": false, "message": "No token provided"})
                            }

                       }else{
                          res.status(422).send({
                             success:false,
                             "message": "Invalid business email/password credentials" 
                          })
                       }

                    })

                 } else {

                   res.status(404).send({"success": false, "message": "Your business email account does not exist"})
                 }
              })
          })

})

router.post('/forgotPassword', function(req,res){
     const email = req.body.forgottenEmail,
     //generate the token and save it to the db and also send to other person.
          token = utils.generateRandomString().toLowerCase()
      if (!email || email === '') {
          return res.status(400).send({success: false, message: 'No email address is provided'})
      }
      dbPool.getConnection(function(err,conn){
         if (err) {
            return next(err)
         }
         var sql = "UPDATE users SET reset_token =  ? WHERE user_email = ?"
         conn.query(sql, [token, email], function(err,results){
              conn.release()
              if (err) {
                 return next(err)
              }
              if(results.changedRows === 1 ){
                 res.status(200).send({success: true, message: token})
                 //go head and send the reset password token to email using sendGrid
              }else{
                res.status(412).send({success: false, message: 'Your business email does not exist'})
              } 
         })
         
      })
      
})


//testing some url parts here.
//http://localhost:3010/testingUrl?token=helogoldsoft&&email=goldsoft@ymail.com
router.get('/testingUrl', function(req,res){
    var url_parts = url.parse(req.url, true)
    var query = url_parts.query
    console.log(query)
    res.status(200).send({'message': query})
})


router.post('/uploadDocuments', function(req,res,next){
   const filePaths = req.body.filePaths //hey u need a middleware to get access
   //to req.files object becoz u cant use plain express to get this

   //cloudinary.v2.uploader.upload()
   res.status(200).send({"message": {filePath: filePaths, hello: req.files}})
})


router.get('/online_availability', function(req,res,next){
    res.status(200).send({success: true, "message": "remote server is available"})
})


module.exports = router
