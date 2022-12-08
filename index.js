const express = require('express');
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const connectDB = require('./db');
const { UrlModel } = require('./models/urlshort')

// mongoose.connect('mongodb://localhost:27017/myurlShortener')
// mongoose.connect('mongodb+srv://Arslan:admin123@cluster0.jiog1sg.mongodb.net/myurlShortener?retryWrites=true&w=majority')
connectDB()

function generateUrl() {
    var rndResult = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < 5; i++) {
        rndResult += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // console.log(rndResult);
    return rndResult
}


const port = 3000;
const app = express()
app.set('view engine', 'ejs');


//Middleware
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }))

//Routes

// app.get('/', (req, res) => {
//     res.send('<h1>hello world</h1>')
// })


app.get('/', (req, res) => {
    let allUrl = UrlModel.find((err, result) => {
        res.render('home', {
            urlResult: result
        })
    })

})

app.post('/create', (req, res) => {
    // console.log(req.body.longurl);
    console.log(generateUrl());
    // Craete a Short URL
    let urlShort = new UrlModel({
        longUrl: req.body.longurl,
        shortUrl: generateUrl()
    })

    urlShort.save((err, data) => {
        if (err) throw err;
        // console.log(data)
        res.redirect('/')
    })

    //Store it in DB
})

app.get('/:urlId', (req, res) => {
    // console.log(req.params.urlId);
    let urlShort = UrlModel.findOne({ shortUrl: req.params.urlId }, (err, data) => {
        if (err) throw err;
        UrlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } }, (err, updateData) => {
            if (err) throw err;
            res.redirect(data.longUrl)
        })

    })
})

app.get('/delete/:id', (req, res) => {
    UrlModel.findByIdAndDelete({ _id: req.params.id }, (err, deleteData) => {
        if (err) throw err;
        res.redirect('/')
    })
})


app.listen(port, () => {
    console.log(`Port is Running in ${port}`);
})


