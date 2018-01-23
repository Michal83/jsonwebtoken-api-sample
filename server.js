const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('./app/models/user');

const PORT = 3000;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello :)');
});

router.get('/', (req, res) => res.json({message: 'Welcome to API'}));

router.get('/users', (req, res) => {
  User.find({}, (err, users) => res.json(users));
});

router.post('/authenticate', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (err)
      throw err;
    if (!user) {
      res.json({success: false, message: 'Authentication failed. User not found.'});
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({success: false, message: 'Authentication failed. Wrong password'});
      } else {
        const token = jwt.sign(user, app.get('superSecret'), {expiresIn: 1440});
        res.json({
          success: true,
          token: token,
          userName: user.name,
          userRole: user.role
        });
      };
    };
  });
});

app.use('/api', router);

app.listen(PORT, () => console.log(`App started on port ${PORT}`));