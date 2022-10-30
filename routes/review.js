const express = require('express');
const router = express.Router();
const {verify} = require('../public/javascripts/middleware')
//declare variables
const {
    renderReview, review, showReview
} = require('../controllers/review');


router.get('/leaveReview', renderReview);

router.get('/review', verify, showReview)

router.post('/leaveReview', review);



module.exports = router;