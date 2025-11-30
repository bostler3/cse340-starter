const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *************************
 * Deliver login view
 * ************************* */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* *************************
 * Deliver registration view
 * ************************* */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* *************************
 * Deliver account management view
 * ************************* */
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/", {
        title: "Account Management",
        nav,
        errors: null
    })
}

/* *************************
 * Process Registration
 * ************************* */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
        // Regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }
    
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }
}

/* *************************
 * Process Login Request
 * ************************* */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* *************************
 * Deliver Edit Account view
 * ************************* */
async function editAccountInfoView(req, res, next) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()
    const data = await accountModel.getAccountById(account_id)
    res.render("account/edit-account", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email
    })
}

/* *************************
 * Process Edit Account
 * ************************* */
async function updateAccountInfo(req, res) {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    let nav = await utilities.getNav()
    const updateResult = await accountModel.editAccount(
        parseInt(account_id),
        account_firstname,
        account_lastname,
        account_email
    )
    if (updateResult) {
        req.flash(
            "notice",
            `Congratulations, your account information was succesfully updated!`
        )
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/edit-account", {
            title: "Edit Account",
            nav,
            errors: null,
            account_id,
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

/* *************************
 * Process Password Change
 * ************************* */
async function updateAccountPassword(req, res) {
    let nav = await utilities.getNav()
    const { account_id, account_password } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
        // Regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the password change')
        res.status(500).render("account/edit-account", {
            title: "Edit Account",
            nav,
            errors: null,
            account_id
        })
    }
    
    const changePasswordResult = await accountModel.changePassword(
        parseInt(account_id),
        hashedPassword
    )

    if (changePasswordResult) {
        req.flash(
            "notice",
            `Congratulations, your account information was succesfully updated!`
        )
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the password change failed.")
        res.status(501).render("account/edit-account", {
            title: "Edit Account",
            nav,
            errors: null,
            account_id
        })
    }
}

/* *************************
 * Deliver Logout view
 * ************************* */
async function buildLogout(req, res, next) {
    res.clearCookie("jwt")
    res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, editAccountInfoView, updateAccountInfo, updateAccountPassword, buildLogout }