const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User');

// Password handler
const bcrypt = require('bcrypt');
const { status } = require('express/lib/response');

// Signup
router.post('/signup', async (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();

  try {
    // Check for empty input fields
    if (name === "" || email === "" || password === "" || dateOfBirth === "") {
      return res.json({
        status: "FAILED",
        message: "Empty input fields!",
      });
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
      // Check for valid name using regex
      return res.json({
        status: "FAILED",
        message: "Invalid name entered",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      // Check for a valid email using regex
      return res.json({
        status: "FAILED",
        message: "Invalid email entered",
      });
    } else if (isNaN(Date.parse(dateOfBirth))) {
      // Check for a valid date of birth
      return res.json({
        status: "FAILED",
        message: "Invalid date of birth entered",
      });
    } else if (password.length < 8) {
      // Check for password length
      return res.json({
        status: "FAILED",
        message: "Password too short!",
      });
    }

    // Checking if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // A user already exists
      return res.json({
        status: "FAILED",
        message: "User with the provided email already exists",
      });
    } else {
      // Try to create a new user

      // Password handling
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        dateOfBirth,
      });

      const result = await newUser.save();
      return res.json({
        status: "SUCCESS",
        message: "Signup successful",
        data: result,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      status: "FAILED",
      message: "An error occurred during signup!",
    });
  }
});



// Login
router.post('/login', (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  
  if (email == "" || password == ""){
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied"
  })
} else {
  //Check user if exist
  User.find({email})
  .then(data => {
    if (data.length) {
      //user exists

      const hashedPassword = data [0].password;
      bcrypt.compare(password, hashedPassword). then (result => {
        if (result) {
          //password match
          res.json ({
            status: "SUCCESS",
            message: "Login Successful",
            data: data
          })
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid password entered!"
          })
        }
    })
      .catch(err => {
        res.json({
        status:"FAILED",
        message: "An error occured while comparing passwords"
      })
    })
  } else {
    res.json ({
      status: "FAILED",
      message: "Invalid credentials entered!"
      })
    }
   })
   .catch(err => {
    res.json ({
      status:"FAILED",
      message: "An error occured while checking for existing user"
    })
   })
  }
})

module.exports = router;
