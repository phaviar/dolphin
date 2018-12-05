class Endpoint {
    constructor(app, { path, params, method, auth }) {
        this.path = path;
        this.params = params;
        this.method = method;
        this.auth = auth;
    }

    run() {
        throw new Error("Run is not implemented");
    }

    userId(token) {
        return this.app.auth.destructToken(token).id;
    }
}