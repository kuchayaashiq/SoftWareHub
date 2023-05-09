const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "Aashiqisa@bo$y";

//ROUTE 1: Create a User using: POST "/api/auth/createUser". Doesn't require login
router.post(
  "/createUser",
  [
    // checking the validation of feilds
    // name must be at least 5 chars long
    body("name", "Enter a valid Name").isLength({ min: 5 }),
    // email must be an valid email
    body("email", "Enter a valid email").isEmail(),
    // password must be at least 6 chars long
    body("password", "Paassword must be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    //check if there is any error and bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whether user with ths email is already exists or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hashSync(req.body.password, salt);

      //create a user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      var authToken = jwt.sign(data, JWT_SECRET);
      // res.json(user);
      res.json({ authToken });
      console.log("created successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);

//ROUTE 2: Authenticate a user using: POST "/api/auth/login". Doesn't require login
router.post(
  "/login",
  [
    // checking the validation of feilds
    // email must be an valid email
    body("email", "Enter a valid email").isEmail(),
    body("password", "password can't be blank").exists(),
  ],
  async (req, res) => {
    //check if there is any error and bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      var authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
      console.log("Logged in  successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);
//ROUTE 3: Get Logged in  user Details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
module.exports = router;
