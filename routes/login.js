const express = require("express");

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
    res.sendFile(__dirname)
}

module.exports = { post, get };