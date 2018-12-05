const mfs = require("./Util/mfs.js");

module.exports = async app => {
    let routes = await mfs.requireFolder("server/api");
    routes = routes.map(Route => new Route(app));

    app.user(async (req, res, next) => {
        const ip = req.headers['X-Forwarded-For'] || req.ip.replace("::fffff:", "");
        const route = routes.find(r => r.path === req.path);
        // If it isnt an api route then let views handle it
        if (!route) return next();

        let body = parseBody(req.body, params);

        try {
            const token = req.headers.authorization || body.token;
            if (route.auth) {
                if (!await app.auth.authenticateToken(token))
                    throw "Invalid Credentials";
            }

            const data = await processRequest(route, body);
            return res.send(data);
        } catch (error) {
            return res.send({error});
        }
    });

    async function processRequest(route, body) {
        if (route.auth) {
            const token = 
        }
    }

    function parseBody(body, params) {
        let args = {};
        const keys = Object.keys(params);
        for (let key in keys) {
            // Only if its equal to 'true' then it is required
            if (params[key] === true && body[key] === undefined)
                throw "Missing Parameter: " + key;
            // Otherwise its considere a default if it dosnt exist
            else if (params[key] !== undefined)
                args[key] = body[key] !== undefined ? body[key] : params[key]
        }
        return args;
    }
};