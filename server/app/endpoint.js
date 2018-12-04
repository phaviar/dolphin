class Endpoint {
    constructor(app, { path, params, auth, view }) {
        this.path = path;
        this.params = params;
        this.auth = auth;
        this.view = view;

        if (this.auth) this.params.token = true;
        this.listen();
    }

    listen() {
        if (typeof this.post === "function")
            this.app.post(this.path, this.rawPost);
        if (typeof this.get === "function")
            this.app.get(this.path, this.rawGet);
    }

    async rawPost(req, res) {
        try {
            const body = this.parseParams(req.body);
            if (this.auth) {
                await this.authenticate(body.token);
            }
            const data = await this.post(body);
            res.send(data);
        } catch(error) {
            return res.send({error});
        }
    }

    async rawGet(req, res) {
        try {
            const body = this.parseParams(req.body);
            if (this.auth) {
                await this.authenticate(body.token);
            }
            const data = await this.get(body);
            res.send(data);
        } catch(error) {
            return res.send({error});
        }
    }

    async authenticate(token) {
        if (!await this.app.database.authenticateToken(token))
            throw "Invalid Token";
    }

    parseParams(body) {
        let args = {};
        const keys = Object.keys(this.params);
        for (let key in keys) {
            // Only if its equal to 'true' then it is required
            if (this.params[key] === true && body[key] === undefined)
                throw "Missing Parameter: " + key;
            // Otherwise its considere a default if it dosnt exist
            else if (this.params[key] !== undefined)
                args[key] = body[key] !== undefined ? body[key] : this.params[key]
        }
        return args;
    }
}