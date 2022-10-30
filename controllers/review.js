const { query } = require('../DB/connection');


module.exports.renderReview = async (req, res) => {
    res.render('review/leaveReview')
};

//show all reviews
module.exports.showReview = async (req, res) => {
    try {
        const results = await query('SELECT favoriteDish, reviewRating, reviewDescription, DATE_FORMAT(reviewDate, "%a, %M %d %Y %h:%i") as Date FROM review WHERE reviewDate > date_sub(now(), interval 4 week) ORDER BY reviewDate;')
        res.render('review/index', { results });
    } catch (error) {
        req.flash('error', 'Something went wrong!');
    }

};

//customer making a new review
module.exports.review = async (req, res) => {
    try {
        const { favoriteDish, reviewDescription, reviewRating } = req.body
        await query(
            'INSERT INTO review (favoriteDish, reviewDescription, reviewRating) VALUES (?, ?, ?)',
            [favoriteDish, reviewDescription, reviewRating])
        req.flash('success', 'Thank you for your feedback!');
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'Review is not successful. Try again!!!');
        res.redirect('/leaveReview');

    }
};








