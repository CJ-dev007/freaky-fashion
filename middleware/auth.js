
module.exports = {
    isAdmin: (req, res, next) => {
       
        if (req.session.user && req.session.user.admin === 1) {
            return next(); 
        }
       
        res.redirect('/login?error=restricted');
    }
};
