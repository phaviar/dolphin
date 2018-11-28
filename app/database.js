const r = require("rethinkdbdash")({ db: "ChatApp" });

class Database {
    async getUser (name) {
        return await r.table("users").get(name);
    }

    async newUser ({ id, username, password, token }) {
        await r.table("users").insert({ id, username, password, token });
    }

    async updateUser (id, { username, password, icon, token }) {
        await r.table("users").get(id).update({ username, password, icon, token });
    }

    async deleteUser (id) {
        await r.table("users").get(id).delete();
    }

    async newMessage ({ id, author, content, timestamp }) {
        await r.table("messages").insert({ id, author, content, timestamp });
    }

    async fetchMessages () {
        return await r.table("messages");
    }
}

module.exports = Database;