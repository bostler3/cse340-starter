const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* *********************
 * Constructs the nav HTML unordered list
 * ********************* */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* *********************
 * Build the classification view HTML
 * ********************* */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' details"><img src="' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* *********************
 * Build the vehicle detail view HTML
 * ********************* */
Util.buildVehicleDetailGrid = async function (data) {
    const make = data[0].inv_make
    const model = data[0].inv_model
    let grid
    grid = '<div id="detail-display">'
    grid += '<div id="vehicle-detail-image">'
    grid += '<img src="' + data[0].inv_image
        + '" alt="Image of ' + make + ' ' + model
        + ' on CSE Motors">'
    grid += '</div>'
    grid += '<div id="vehicle-detail-data">'
    grid += '<h2>'
    + make + ' ' + model + ' Details'
    grid += '</h2>'
    grid += '<div id="vehicle-data">'
    grid += '<p id="vehicle-price">'
    // Got help from a Bing search for "javascript javascript u.s. dollars" and "javascript intl numberformat no decimal places"
    + '<span class="detail-label">' + 'Price: ' +  '</span>' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data[0].inv_price)
    grid += '</p>'
    grid += '<p id="vehicle-description">'
    + '<span class="detail-label">' + 'Description: ' +  '</span>' + data[0].inv_description
    grid += '</p>'
    grid += '<p id="vehicle-color">'
    + '<span class="detail-label">' + 'Color: ' +  '</span>' + data[0].inv_color
    grid += '</p>'
    grid += '<p id="vehicle-miles">'
    + '<span class="detail-label">' + 'Miles: ' +  '</span>' + new Intl.NumberFormat("en-US", {minimumFractionDigits: 0, maximumFractionDigits: 0}).format(data[0].inv_miles)
    grid += '</p>'
    grid += '</div>'
    grid += '</div>'
    grid += '</div>'
    return grid
}

/* *********************
 * Build the vehicle classification drop-down list HTML
 * ********************* */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList = 
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value='' disabled hidden>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected"
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* *********************
 * Middleware for handling errors
 * Wrap other function in this for
 * General error handling
 * ********************* */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* *********************
 * Middleware to check token validity
 * ********************* */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            }
        )
    } else {
        next()
    }
}

/* *********************
 * Check login
 * ********************* */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

module.exports = Util