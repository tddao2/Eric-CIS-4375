const express = require('express');
const path = require('path');

//boilerplate
const ejsMate = require('ejs-mate');
//module to create session for log in
const session = require('express-session');
//displays message
const flash = require('connect-flash');
const methodOverride = require('method-override');
//establish connection to db create a string for path
const { connection } = require('./DB/connection');
//user route
const userRoutes = require('./routes/users');
//reservatin route
const reservationRoutes = require('./routes/reservation');
//review route
const reviewRoutes = require('./routes/review');
//file to access mysql/ google app password /NodeMailer
require('dotenv').config();
//use express
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

//declare sessionConfig function
const sessionConfig = {
    //uses secret key to create session
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        //time period of login
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

//use session Config
app.use(session(sessionConfig));
//use flash function
app.use(flash());

app.use((req, res, next) => {
    //create session
    res.locals.session = req.session;
    res.locals.session.loggedin = req.session.loggedin;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
//default route to index(reservation)
app.get('/', (req, res) => {
    res.render('home');
});

//reservation route 
app.use('/', reservationRoutes);

//review route 
app.use('/', reviewRoutes);




// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = 'Oh No, Something Went Wrong!';
//     res.status(statusCode).render('error', { err });
// });

app.listen(3000, () => {
    console.log('Serving on port 3000');
});
