
module.exports = {
    isAdmin: (req, res, next) => {
        // Vi kollar om user finns i sessionen och om admin-kolumnen är 1
        if (req.session.user && req.session.user.admin === 1) {
            return next(); // "Dörrvakten" släpper förbi dig till nästa steg
        }
        // Om du inte är admin får du ett felmeddelande
        res.status(403).send('Åtkomst nekad. Du måste vara admin.');
    }
};
