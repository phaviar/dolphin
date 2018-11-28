class Model {
    validateString(str, len) {
        return typeof str === "string" && str.length <= len;
    }

    validateId(id) {

    }
}

class UserModel extends Model {
    constructor(data) {
        super();
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.token = data.token;
        this.validate();
    }

    validate() {
        
    }
}

module.exports = UserModel;