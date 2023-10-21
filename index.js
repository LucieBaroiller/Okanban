const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = require('./app/routers');
var cors = require('cors')
const rateLimit = require('express-rate-limit')
 


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({
    origin: "*"
  }
))

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 9999, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
 
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use(router);


app.listen(PORT, () => {
  console.log(`Listening on ${PORT} ...`);
});