const express = require('express');

const app = express();

//running the app with a test response while launching it

// app.use((req,res,next) => {
//     res.status(200).json({
//         message:"The app is working"
//     });
// });

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

const userRoute = require('./apiCalls/routes/users');

app.use( userRoute);

app.use('/',(req,res) => {
    res.send("It works")
})


//exporting the app
module.exports = app;
