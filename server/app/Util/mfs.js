const fs = require("fs");
const path = require("path");
const Logger = require("./logger.js");

const readdir = dir =>
    new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) return reject(err);
            resolve(files);
        });
    });

const readFile = file =>
    new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });

/**
 * Read every file in a folder with fs.readFile.
 * @param {String} folder - The folder to read.
 * @param {String|Array} limit - Limit extensions that are read.
 * @returns {Array} Array of file contents
 */
exports.readFiles = async function (folder, limit) {
    let files = (await readdir(folder))
        .filter(name => {
            let fileExt = name.split(".").pop();
            // If its in the limit array, or the limit string is equal to the extension
            return (Array.isArray(limit) && limit.includes(fileExt)) ||
                limit === fileExt;
        });

    let result = [];
    for (let file of files) {
        try {
            const read = await readFile(folder + "/" + file);
            result.push(read);
        } catch (e) {
            Logger.error('file read', `${folder}/${file}`, e.stack);
        }
    }
    return result;
};

exports.requireFolder = async function (folder) {
    let files = (await readdir(folder))
        .filter(name => name.split(".").pop() === "js");

    let result = [];
    for (let file of files) {
        try {
            const read = require(path.join(process.cwd, folder, file));
            result.push(read);
        } catch (e) {
            Logger.error("file require", `${folder}/${file}`, e.stack);
        }
    }
    return result;
};