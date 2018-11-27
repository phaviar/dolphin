const express = require("express");
const auth = require("../app/auth.js");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function post (req, res) {


}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function get (req, res) {
    res.sendFile(process.cwd() + "/views/login.html");
}

module.exports = { post, get };