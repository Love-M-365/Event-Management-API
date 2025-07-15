const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router.post("/", userController.createUser);                    
router.get("/", userController.getAllUsers);                   
router.post("/register", userController.registerUserToEvent);   
router.post("/cancel", userController.cancelUserRegistration);  

module.exports = router;
