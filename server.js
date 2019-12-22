const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Cryptr = require('cryptr');
var app = express();
var cryptr = new Cryptr("this is my secret key");

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    if (req.cookies['username'] == undefined) {
        res.render('index');
    }
    else {
        res.redirect('/profile');
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    res.cookie('token', cryptr.encrypt(username), { maxAge: 1000 * 60 * 60 });
    res.redirect('/profile');
});

app.get('/profile', (req, res) => {
    if (req.cookies['token'] == undefined) {
        res.redirect('/logout');
    } else {
        res.send(`Welcome ${cryptr.decrypt(req.cookies['token'])}`);
        console.log(req.cookies['token']);
    }
});

app.get('/logout',(req,res) =>{
    if (req.cookies['token'] == undefined) {
        res.redirect('/');
    } else {
        res.clearCookie('token');
        res.redirect('/');
    }
});

app.listen(8000, () => {
    console.log("server listening on port 8000");
});
