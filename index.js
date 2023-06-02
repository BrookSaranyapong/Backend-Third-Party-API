const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const config = require('./config/index.js');
const usersRouter = require('./routes/user.js');
const openaiRouter = require('./routes/openai.js');
const errorHandler = require('./middlewares/errorHandler.js');

const app = express();

// middlewares 
app.use(cors());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 วินาที
    max: 5 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);
app.use(helmet());

// connect to database
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });
  

app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//init passport
app.use(passport.initialize());

// routes
app.use('/api/user', usersRouter);
app.use('/api/openai', openaiRouter);

app.get('/', (req, res) => {
    res.json({ message: 'my api server' })
})

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
