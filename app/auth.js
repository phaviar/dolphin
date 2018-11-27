const bcrypt = require("bcrypt");
const chepoch = 1543303383712;

class Auth {
    static async createHash(pass) {
       const salt = await bcrypt.genSalt();
       return await bcrypt.hash(pass, salt);
    }

    static async comparePass(pass) {

    }

    static createToken(id) {
        // id . random . timestamp
        const random = new Array(10).fill(0).map(_ => randomChar()).join``;
        const timestamp = Date.now() - chepoch;
        const token = `${id}.${random}.${timestamp}`;
      
        return Buffer.from(token).toString("base64");
    }

    static destructToken(token) {
        const data = Buffer.from(token, "base64").toString();
       
        let [ id, random, timestamp ] = data.split(".");
        timestamp = new Date(parseInt(timestamp) + chepoch);

        return { id, random, timestamp };
    }
}

function randomChar() {
    const random = Math.round(Math.random() * 222) + 33;
    return String.fromCharCode(random);
}

module.exports = Auth;