const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* *************************
 * Add New Classification Data Validation Rules
 * ************************* */
validate.addNewClassificationRules = () => {
    return [
        // classification_name is required, must be string and must be alphabetic characters only
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage("Please provide a correct classification name.") // on error, this message is sent
            .custom(async (classification_name) => {
                        const classificationExists = await invModel.checkExistingClassification(classification_name)
                        if (classificationExists) {
                            throw new Error("That classification exists. Please use a different classification name.")
                        }
                    })
    ]
}

/* *************************
 * Check New Classification data and return errors or continue to inventory management
 * ************************* */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

/* *************************
 * Add New Vehicle Data Validation Rules
 * ************************* */
validate.addNewVehicleRules = () => {
    return [
        // Classification is required
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isInt()
            .toInt()
            .withMessage("Please select a classification name."), // on error, this message is sent
        
        // Make is required and must be at least three characters
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a vehicle make that is at least three characters long."), // on error, this message is sent
        
        // Model is required and must be at least three characters
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please enter a vehicle model that is at least three characters long."), // on error, this message is sent
        
        // Description is required
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Please enter a vehicle description."), // on error, this message is sent
        
        // Image path is required
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please enter a path for the vehicle's image file."), // on error, this message is sent
        
        // Thumbnail image path is required
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please enter a path for the vehicle's thumbnail image file."), // on error, this message is sent
        
        // Price is required and must be a number without commas
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isInt({min: 0})
            .toInt()
            .withMessage("Please enter a vehicle price as a positive number with no commas."), // on error, this message is sent
        
        // Year is required and must be four digits
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .isLength({ min: 4, max: 4 })
            .withMessage("Please enter a four-digit year, (example: 2025)."), // on error, this message is sent
        
        // Miles is required and must be numbers only
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isInt({min: 0})
            .toInt()
            .withMessage("Please enter the vehicle's miles as a positive number with no commas (example: 10000)."), // on error, this message is sent
        
        // Description is required
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please enter a vehicle color.") // on error, this message is sent
    ]
}

/* *************************
 * Check New Vehicle data and return errors or continue to inventory management
 * ************************* */
validate.checkAddVehicleData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList()
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next()
}

/* *************************
 * Check Edit Vehicle data and return errors to the edit inventory view
 * ************************* */
validate.checkEditVehicleData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList()
        res.render("./inventory/edit-inventory", {
            errors,
            title: "Edit Inventory",
            nav,
            classificationList,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next()
}

module.exports = validate