module.exports.verify = async (req, res, next) => {
    //if session is logged in then return page
    try {
        if (req.session.loggedin) {
            return next();
        }
        //if session is not logged in then redirect to login page
        res.redirect('/login');
    } catch (error) {
        //display login error message
        req.flash('error', 'Invalid username or password!!!');
        res.redirect('/login');
    }
};
//convert to capitalize first letter -export
module.exports.capitalizeFirstLetter = async(string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}