const express = require("express");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function get (req, res) {
    let id = req.app.snowflake.nextId();
    res.send(id);
    console.log(req.app.snowflake.destruct(id));
}

module.exports = { get };