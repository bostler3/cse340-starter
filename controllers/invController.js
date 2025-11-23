const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* *************************
 * Build inventory by classification view
 * ************************* */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    
    // This is to properly generate the view's title (className variable)
    const classificationSql = await invModel.getClassifications()
    const classifications = classificationSql.rows
    const index = classifications.findIndex(num => num.classification_id === Number(classification_id)) // Got help from a Bing search for: "look up an index in an array javascript by value of element"
    const className = classifications[index].classification_name
    
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null
    })
}

/* *************************
 * Build inventory by vehicle detail view
 * ************************* */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inv_id)
    const grid = await utilities.buildVehicleDetailGrid(data)
    let nav = await utilities.getNav()
    const vehicleYear = data[0].inv_year
    const vehicleMake = data[0].inv_make
    const vehicleModel = data[0].inv_model
    res.render("./inventory/detail", {
        title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
        nav,
        grid,
        errors: null
    })
}

/* *************************
 * Throw intentional 500 error
 * ************************* */
// Got some help from a team member on this and a Bing search for "throw new error in a function node.js"
invCont.throwIntentionalError = function () {
    let err = new Error("Intentional 500 error")
    err.message = "Intentional 500 error"
    throw err
}

/* *************************
 * Build management view
 * ************************* */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null
    })
}

/* *************************
 * Deliver Add Classification view
 * ************************* */
invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    })
}

/* *************************
 * Process Add Classification
 * ************************* */
invCont.addNewClassification = async function (req, res) {
    const { classification_name } = req.body
    
    const addResult = await invModel.addNewClassification(
        classification_name
    )
    let nav = await utilities.getNav()

    if (addResult) {
        req.flash(
            "notice",
            `The ${classification_name} classification has been added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, adding the new classification failed.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null
        })
    }
}

/* *************************
 * Deliver Add Inventory view
 * ************************* */
invCont.buildAddInventoryView = async function (req, res, next) {
    const classificationList = await utilities.buildClassificationList()
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null
    })
}

/* *************************
 * Process Add Inventory
 * ************************* */
invCont.addNewVehicle = async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    const addResult = await invModel.addNewVehicle(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        parseFloat(inv_price),
        parseInt(inv_miles),
        inv_color,
        parseInt(classification_id)
    )
    
    if (addResult) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} vehicle has been added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, adding the new vehicle failed.")
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors: null
            
        })
    }
}

module.exports = invCont