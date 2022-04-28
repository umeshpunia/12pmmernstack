const express = require("express");
const UserSchema = require("../models/user.model");
const bcrypt = require("bcrypt");

const router = express.Router();

// adding user
router.post("/user/add", (req, res) => {
  const { email, password, name } = req.body;

  // if one field is missing
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ status: 400, msg: "Please Enter All Fields" });

  // hashing password
  bcrypt.hash(password, 12, (err, hashPass) => {
    if (err) return res.status(500).json({ status: 500, msg: err });

    if (!hashPass)
      return res
        .status(501)
        .json({ status: 501, msg: "Password Not Encrypted" });

    // insert into mongodb

    let insUser = new UserSchema({ name, email, password: hashPass });

    insUser
      .save()
      .then((result) => {
        res.status(200).json({ status: 200, msg: "User Added Successfully" });
      })
      .catch((err) => {
        return res.status(502).json({ status: 502, msg: err.message });
      });
  });
});

// all users
router.get("/users", (req, res) => {
  UserSchema.find({}, (err, data) => {
    if (err) return res.status(502).json({ status: 502, msg: err.message });
    if (data.length > 0) {
      return res.status(200).json({ status: 200, msg: data });
    } else {
      res.status(200).json({ status: 200, msg: "No User Added yet!" });
    }
  });
});

// single user

router.get("/user/:_id", (req, res) => {
  const { _id } = req.params;

  UserSchema.findOne({ _id }, (err, data) => {
    if (err) return res.status(502).json({ status: 502, msg: err.message });
    if (!data) {
      return res.status(404).json({ status: 404, msg: "Not Found" });
    }
    res.status(200).json({ status: 200, msg: data });
  });
});

// login

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ status: 400, msg: "Please Enter All Fields" });

  // if email and pass exists
  UserSchema.findOne({ email }, (err, data) => {
    if (err) return res.status(502).json({ status: 502, msg: err.message });
    if (!data) {
      return res.status(404).json({ status: 404, msg: "Not Found" });
    }
    let dbPass = data.password;
    // password match
    bcrypt.compare(password, dbPass, (err, valid) => {
      if (err) return res.status(502).json({ status: 502, msg: err.message });
      if (!valid) {
        return res.status(404).json({ status: 404, msg: "Not Found Password" });
      }
      res.status(200).json({ status: 200, msg: "Login Success" });
    });
  });
});

// update

router.put("/user/:_id", (req, res) => {
    const { _id } = req.params;
    const {name}=req.body;
    UserSchema.findOneAndUpdate({_id},{name},(err,data)=>{
        if (err) return res.status(502).json({ status: 502, msg: err.message });
        if (!data) {
          return res.status(404).json({ status: 404, msg: "Not Found" });
        }
        res.status(200).json({ status: 200, msg: "Name Changed" });  
    })
  
})



// delete
router.delete("/user/:_id", (req, res) => {
    const { _id } = req.params;
    UserSchema.findOneAndDelete({_id},(err,data)=>{
        if (err) return res.status(502).json({ status: 502, msg: err.message });
        if (!data) {
          return res.status(404).json({ status: 404, msg: "Not Found" });
        }
        res.status(200).json({ status: 200, msg: "Deleted Successfully" });  
    })
  
})

module.exports = router;
