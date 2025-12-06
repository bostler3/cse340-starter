const pool = require("../database/")

/* ***************************
 * Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Check for existing e-mail address
 * *************************** */
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Return account data using e-mail address
 * *************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching e-mail address found.")
    }
}

/* ***************************
 * Return account data using account_id
 * *************************** */
async function getAccountById(account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
            [account_id])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching account found.")
    }
}

/* ***************************
 * Edit account info
 * *************************** */
async function editAccount(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
        return data.rows[0]
    } catch (error) {
        console.error("model error for editing account: " + error)
    }
}

/* ***************************
 * Change password
 * *************************** */
async function changePassword(account_id, account_password) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const data = await pool.query(sql, [account_password, account_id])
        return data.rows[0]
    } catch (error) {
        console.error("model error for changing password: " + error)
    }
}

/* ***************************
 * Get all accounts
 * *************************** */
async function getAccounts() {
    try {
        return await pool.query("SELECT * FROM public.account ORDER BY account_lastname")
    } catch (error) {
        console.error("Model error for getting all accounts: " + error)
    }
}

/* ***************************
 * Process sending a message
 * *************************** */
async function sendAMessage(message_to_id, message_from_id, message_subject, message_body) {
    try {
        const sql = "INSERT INTO message (message_to_id, message_from_id, message_subject, message_body) VALUES ($1, $2, $3, $4) RETURNING *"
        return await pool.query(sql, [message_to_id, message_from_id, message_subject, message_body])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Get all messages by user_id
 * *************************** */
async function getMessagesByUserId(account_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.message AS m
            JOIN public.account AS a
            ON m.message_from_id = a.account_id
            WHERE m.message_to_id = $1`,
            [account_id]
        )
        return data.rows
    } catch (error) {
        console.error("getMessagesByUserId error " + error)
    }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, editAccount, changePassword, getAccounts, sendAMessage, getMessagesByUserId }