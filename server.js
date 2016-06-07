//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var app = express();
var jsonfile = require('jsonfile');
var nodemailer = require('nodemailer');


//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

//Configures the Template engine
app.engine('html', handlebars({
    defaultLayout: 'layout',
    extname: '.html'
}));
app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: true
}));



//set environment ports and start application
app.set('port', process.env.PORT || 3000);

//routes
app.get('/', function(req, res) {
    res.render('index');
});

app.post('/mail', function(req, res) {
    console.log(req.body);
    console.log(process.env.PASSWORD)
    // var transporter = nodemailer.createTransport('smtps://lxiaoleonli%40gmail.com:' + process.env.PASSWORD + '@smtp.gmail.com');
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail", // sets automatically host, port and connection security settings
        auth: {
            user: "leonserver980@gmail.com",
            pass: process.env.PASSWORD
        }
    });
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: req.body.email, // sender address
        to: 'li.lxiao@yahoo.com', // list of receivers
        subject: 'Hello,' + req.body.name + 'messaged you online', // Subject line
        text: req.body.message, // plaintext body
        html: '<b>'+req.body.message+' </b><p>Phone number:'+req.body.phone+'</p>' // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log(info)
        console.log('Message sent: ' + info.response);
    });

    res.json({
        success: "true"
    })
})

app.get('/LeonLiResume', function(req, res) {
    var file = __dirname + '/LeonLiResume.pdf';
    res.download(file); // Set disposition and send it.
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});