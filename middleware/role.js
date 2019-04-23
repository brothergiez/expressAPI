module.exports = function role(req, res, next) {
    if (!req.user.isAdmin)
        return res.status(403).send({
            error: {
                message: 'Access denied'
            }
        });
    next();
};
