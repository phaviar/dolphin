const usernameRegex = /^[A-Za-z0-9_]{3,32}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,100}$/;
const tokenDecay = 604800000; // 7 days;

class Validation {
    static username(u) {

    }

    static password(p) {

    }

    static id(i) {

    }

    static token(t) {

    }
}

module.exports = Validation;