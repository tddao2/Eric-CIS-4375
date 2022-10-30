const express = require('express');
const router = express.Router();
const {verify} = require('../public/javascripts/middleware')

//declare variables
const {
    register,
    login,
    renderLogin,
    renderRegister,
    logout, manageUser, activate, deactivate, reject
} = require('../controllers/users');

//login/register routes
router.get('/login', renderLogin);
router.post('/login', login);
router.get('/register', renderRegister);
router.post('/register', register);
router.get('/logout', logout);
router.get('/manageUsers', verify, manageUser)
router.get('/manageUsers/activate/:id', verify,activate)
router.get('/manageUsers/deactivate/:id', verify, deactivate)
router.get('/manageUsers/delete/:id', verify, reject)

module.exports = router;
