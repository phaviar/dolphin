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
    }

    validate() {
        
    }
}

module.exports = UserModel;