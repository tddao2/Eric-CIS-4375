const { query } = require('../DB/connection');
const {capitalizeFirstLetter} = require('../public/javascripts/middleware')
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports.renderReservationForm = (req, res) => {
  res.render('reservation/reservationForm');
};

//show all reservations made 
module.exports.renderReservation = async (req, res) => {
  try {
      const results = await query(
          'SELECT reservationID, concat(firstname," ",lastname) as name, phoneNumber, email, b.reservationTypeName, c.roomName, d.occasionName, persons, DATE_FORMAT(reservationDate, "%a, %M %d %Y") as Date, time_format(reservationTime, "%h:%i %p") AS Time, status FROM reservation a \
      left outer join reservationType b \
          ON a.reservationTypeID = b.reservationTypeID \
      left outer join room c \
          ON a.roomID = c.roomID \
      left outer join occasion d \
          ON a.occasionID = d.occasionID WHERE reservationDate >= CURDATE() \
          ORDER BY reservationDate, reservationTime ASC'
      );
      res.render('reservation/index', { results });
  } catch (error) {
      req.flash('error', 'Something went wrong!');
  }
};

//send an email to customer making a new reservation
module.exports.reservation = async (req, res) => {
  try {
    const { firstname, lastname, phoneNumber, email, reservationType, room, occasion, number, date, time } = req.body;
    //First name input will be capitilize by default
    const capitalizeF = await capitalizeFirstLetter(firstname)
    //Last name input will be capitilize by default
    const capitalizeL = await capitalizeFirstLetter(lastname)

    //using NodeMailer module
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    //send out email to customer upon registration
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'RESERVATION STATUS!!!',
      text: `HELLO ${firstname} ${lastname}!. Your reservation is waiting for approval.`
      // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
    };

    //send error /info
    const isEmail = transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    console.log(req.body)

    //insert reservation into the database    
    await query('INSERT INTO reservation(reservationTypeID, roomID, occasionID, firstName, lastName, email, phoneNumber, persons, reservationDate, reservationTime) \
                    values(?,?,?,?,?,?,?,?,?,?)', [reservationType, room, occasion, capitalizeF, capitalizeL, email, phoneNumber, number, date, time]);
    // req.flash('success', 'You have successfully made a reservation! Keep ');
    req.flash('success', 'Your reservation is waiting for approval');
    res.redirect('/');
  } catch (error) {
    req.flash('error', 'Reservation is not successful. Try again!!!');
    res.redirect('/');
  }
};

//accept reservation
module.exports.accept = async (req, res) => {
  try {
    const { id, email } = req.params;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    //send out email when reservation is approved
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'RESERVATION STATUS!!!',
      text: `Your reservation is approved. We're looking forwared to see you!!!`
      // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    await query('UPDATE reservation SET status = 1 WHERE reservationID = ?', [id]);

    req.flash('success', 'The reservation is accepted!!!');
    res.redirect('/reservation');
  } catch (error) {
    req.flash('error', 'Something went wrong');
    res.redirect('/reservation');
  }
};
//send out reject email
module.exports.reject = async (req, res) => {
  try {
    const { id, email } = req.params;
    // console.log(req.params)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    //send out email for reject reservation
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'RESERVATION STATUS!!!',
      text: `Your reservation is denied. Please give us a call.`
      // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
    //update reservation status in DB to denied
    await query('UPDATE reservation SET status = 2 WHERE reservationID = ?', [id]);
    req.flash('success', 'The reservation is denied!!!');
    res.redirect('/reservation');
  } catch (error) {
    req.flash('error', 'Something went wrong');
    res.redirect('/reservation');
  }
};

//get data
module.exports.getData = async (req, res) => {
  // if (req.query) {
  //   console.log(req.query.search_query)
  // }
  
  //query for most room used  report
  ///show default the past month
  try {
      const bar = await query(
          'select roomName, count(*) as count from reservation a \
          join room b on a.roomID = b.roomID \
          WHERE reservationDate > date_sub(now(), interval 4 week) \
          group by roomName;'
      );
      //query for most reservation type used report 
      //show default the past month
      const line = await query(
          'select DATE_FORMAT(reservationDate, "%M %d") as Date, count(*) as count from reservation a \
        join room b on a.roomID = b.roomID \
        WHERE reservationDate > date_sub(now(), interval 4 week) \
        group by reservationDate order by reservationDate;'
      );
        //query for highest volumn of reservation report 
        //show default the past month
      const pie = await query(
          'select reservationTypeName as Type, count(*) as count from reservation a \
        join reservationType b on a.reservationTypeID = b.reservationTypeID \
        WHERE reservationDate > date_sub(now(), interval 4 week) \
        group by reservationTypeName;'
      );
      
         //query for review rating report
      const review = await query('SELECT DATE_FORMAT(reviewDate, "%M %d") as Date, ROUND(avg(reviewRating),1) as Rate, round(avg(AVG(reviewRating)) over(),1) as Average FROM review WHERE reviewDate > date_sub(now(), interval 4 week) group by Date order by reviewDate;');

      res.status(200).json({ values: { bar, line, pie, review } });
  } catch (error) {
      console.log(error);
  }
};
//filter for all reports
module.exports.filter = async (req, res) => {
  try {
      //convert slash on date to dash
      const value = req.query.search_query.split(' - ');
      const from = value[0].replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$1-$2');
      const to = value[1].replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$1-$2');
      
      //filter reservation  room used date beteween 2 dates / group by room name
      const bar = await query(
          'select roomName, count(*) as count from reservation a join room b on a.roomID = b.roomID WHERE reservationDate between ? and ? group by roomName;',
          [from, to]
      );
      //filter highest reservation - date between 2 dates / group by reservation date
      const line = await query(
          'select DATE_FORMAT(reservationDate, "%M %d") as Date, count(*) as count from reservation a join room b on a.roomID = b.roomID WHERE reservationDate between ? and ? group by reservationDate order by reservationDate;',
          [from, to]
      );
      //filter reservation type - date between 2 dates 
      const pie = await query(
        'select reservationTypeName as Type, count(*) as count from reservation a join reservationType b on a.reservationTypeID = b.reservationTypeID WHERE reservationDate between ? and ? group by reservationTypeName;',
        [from, to]
      );

      //filter by review rating date between 2 dates
      const review = await query('SELECT DATE_FORMAT(reviewDate, "%M %d") as Date, ROUND(avg(reviewRating),1) as Rate, round(avg(AVG(reviewRating)) over(),1) as Average FROM review \
          WHERE DATE_FORMAT(reviewDate, "%Y-%c-%d") between ? and ? group by Date order by reviewDate',
          [from, to]
      );

       //read req and return values for each graph
      res.status(200).json({ values: { bar, line, pie, review } });
  } catch (error) {
      console.log(error);
  }
};

//render reports page 
module.exports.report = async(req, res) => {
  try {
      res.render('reservation/reports')
  } catch (error) {
      console.log(error);
  }
}

// https://stackoverflow.com/questions/72547853/unable-to-send-email-in-c-sharp-less-secure-app-access-not-longer-available/72553362#72553362