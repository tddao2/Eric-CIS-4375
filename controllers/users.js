const { query } = require('../DB/connection');
const {capitalizeFirstLetter} = require('../public/javascripts/middleware')
const bcrypt = require('bcrypt');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

//render all the users that is employee(user)
module.exports.manageUser = async (req, res) => {
    try {
        const results = await query('SELECT userId, username, email, roleId, active FROM users WHERE roleId = 2;')

        res.render('users/manageUsers', { results });
    } catch (error) {
        req.flash('error', 'Something went wrong');

    }

};
//encrypt the password
module.exports.register = async (req, res) => {
    const { email, username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //register new employee
    try {
        await query(
            'INSERT INTO users(username, password, email) VALUES (?, ?, ?)',
            [username, hash, email]
        );
        req.flash('success', 'Register successfully!');
        res.redirect('/login');
    } catch (error) {
        // return res.status(400).send(error);
        if (error.errno == 1062) {
            //redirect to register page
            //throw message user has already exist
            req.flash('error', 'User already exists!');
            res.redirect('/register');
        } else {
            //redirect to error
            req.flash('error', 'Something went wrong!');
            res.redirect('/register');
        }
    }
};

module.exports.renderLogin = (req, res) => {
    //render login page
    res.render('users/login');
};

//select the req body users
module.exports.login = async (req, res, next) => {
    try {
        //login with user/password
        const { username, password } = req.body;
        const result = await query('SELECT * from users WHERE username = ?', [
            username,
        ]);
        //if the encrypted password doesnt match, then send an error
        if (!result || !(await bcrypt.compare(password, result[0].password))) {
            req.flash('error', 'Invalid username or password!');
            res.redirect('/login');
        }
        //if inactive then send to error/pending
        else if (result[0].active == 0) {
            req.flash('error', 'Pending!');
            res.redirect('/login');
        }
        //if active and session is true and is false then direct to reservation page with name 
        else if (result[0].active == 1 && result[0].roleId == 2) {
            req.session.loggedin = true;
            req.session.isAdmin = false;
            req.flash('success', `Welcome back, ${await capitalizeFirstLetter(result[0].username)}`);
            res.redirect('/reservation');
        }
        //if account is active and admin then welcome back the admin to mnanage users
        else if (result[0].active == 1 && result[0].roleId == 1) {
            req.session.loggedin = true;
            req.session.isAdmin = true;
            req.flash('success', `Welcome back, ${await capitalizeFirstLetter(result[0].username)}`);
            res.redirect('/manageUsers');
        }

        //if error of invalid username/password then redirect to login page
    } catch (error) {
        req.flash('error', 'Invalid username or password!!!');
        res.redirect('/login')
        // return res.status(400).send(error);
    }
};

//logout user and destroy session
module.exports.logout = async (req, res, next) => {
    req.session.destroy((err) => {
        console.log('Destroyed session');
        res.redirect('/login');
    });
};

//function to activate user by changing status in db
module.exports.activate = async (req, res) => {
    const id = req.params.id;
    try {
        await query('UPDATE users SET active = 1 WHERE userId = ?', [id])
        req.flash('success', 'Employee account has been activated')
        res.redirect('/manageUsers');
    } catch (error) {
        req.flash('error', 'Something went wrong')
        res.redirect('/manageUsers')
    }
}
//function to dectivate  user by changing status in db
module.exports.deactivate = async (req, res) => {
    const id = req.params.id;
    try {
        await query('UPDATE users SET active = 0 WHERE userId = ?', [id])
        req.flash('success', 'Employee account has been deativated')
        res.redirect('/manageUsers');
    } catch (error) {
        req.flash('error', 'Something went wrong')
        res.redirect('/manageUsers')
    }
}
//function to reject  user by changing status in db
module.exports.reject = async (req, res) => {
    const id = req.params.id;
    try {
        await query('DELETE from users WHERE userId = ?', [id])
        req.flash('success', 'Account has been deleted!')
        res.redirect('/manageUsers');
    } catch (error) {
        req.flash('error', 'Something went wrong')
        res.redirect('/manageUsers')
    }
}
// https://github.com/elderny/mysql_Login/tree/main/MySQL_Login_Page
// https://codeburst.io/node-js-mysql-and-async-await-6fb25b01b628