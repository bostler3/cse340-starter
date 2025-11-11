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
    const className = data[0].classification_name
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

module.exports = invCont