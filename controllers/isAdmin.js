'use strict';

let isAdmin = {};

isAdmin = (req, res, next) => {
    let user = req.locals.user;
    if (req.user.isAdmin) {
        return true;
    }
    next();
}

module.exports = isAdmin;
