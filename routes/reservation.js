const express = require('express');
const router = express.Router();
const { verify } = require('../public/javascripts/middleware');

const {
    renderReservation,
    reservation,
    renderReservationForm,
    accept,
    reject,
    report,
    getData,
    filter,
} = require('../controllers/reservation');

router.get('/reservation', verify, renderReservation);

router.get('/reservationForm', renderReservationForm);

router.post('/makeReservation', reservation);

router.get('/reservation/accept/:id/:email', verify, accept);

router.get('/reservation/reject/:id/:email', verify, reject);

router.get('/reservation/report', verify, report);

router.get('/reservation/get_data', verify, getData);

router.get('/reservation/filter', verify, filter);

module.exports = router;