// Needed resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// Route for Account Login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for Registration
router.get("/registration", utilities.handleErrors(accountController.buildRegister));

// Route for Account Management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to edit account information
router.get("/edit-account/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.editAccountInfoView));

// Route to Messaging System
router.get("/messaging", utilities.checkLogin, utilities.handleErrors(accountController.buildMessagingSystem));

// Route to Send a Message form
router.get("/send-message", utilities.checkLogin, utilities.handleErrors(accountController.buildSendMessage));

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.buildLogout));

// Route to process the registration data
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Process the account information update attempt
router.post(
    "/edit-account",
    regValidate.editAccountInfoRules(),
    regValidate.checkEditAccountInfoData,
    utilities.handleErrors(accountController.updateAccountInfo)
)

// Process the account password change attempt
router.post(
    "/edit-account-password",
    regValidate.editAccountPasswordRules(),
    regValidate.checkEditAccountPasswordData,
    utilities.handleErrors(accountController.updateAccountPassword)
)

// Process sending a message
router.post(
    "/send-message",
    regValidate.sendMessageRules(),
    regValidate.checkSendMessageData,
    utilities.handleErrors(accountController.sendMessage)
)

module.exports = router