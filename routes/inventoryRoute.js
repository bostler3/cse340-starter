// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const addValidate = require("../utilities/management-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to intentional 500 error
router.get("/error", utilities.handleErrors(invController.throwIntentionalError));

// Route to management view
router.get("/management", utilities.handleErrors(invController.buildManagementView));

// Route to Add Classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to process the Add Classification data
router.post(
    '/add-classification',
    addValidate.addNewClassificationRules(),
    addValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addNewClassification)
)

// Route to Add Inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to process the Add Inventory data
router.post(
    '/add-inventory',
    addValidate.addNewVehicleRules(),
    addValidate.checkAddVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
)

module.exports = router;