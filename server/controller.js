
//loads saved module 'express' a server framework
const express = require('express')
//sets an instance of 'express' module to the constant 'app'
const app = express()
//load saved module 'mustache-express' a way of creating server side pages
const mustacheExpress = require('mustache-express')

const Trip = require('./trip')
//load express-session module for saving the session of a user in a cookie
var session = require('express-session')

// setting up middleware to use the session
app.use(session({
  // Required option, used to sign the session ID cookie. 
  secret: 'lizard',
  // Forces the session to be saved back to the session store, even if the session was never modified during the request.
  resave: false,
  // Forces a session that is 'uninitialized' to be saved to the store. A session is uninitialized when it is new, but not modified
  saveUninitialized: false
}))



let trips = []

let tripPics = {
    'Tokyo' : 'https://www.japan-guide.com/thumb/XYZeXYZe3009_375.jpg',
    'Amsterdam' : 'https://www.telegraph.co.uk/content/dam/Travel/Destinations/Europe/Netherlands/Amsterdam/Amsterdam-xlarge.jpg',
    'Dublin' : 'https://lonelyplanetimages.imgix.net/mastheads/stock-photo-temple-bar-district-in-dublin-at-night-100904953%20.jpg?sharp=10&vib=20&w=1200',
    'Berlin' : 'https://www.visitberlin.de/system/files/styles/visitberlin_teaser_single_visitberlin_mobile_1x/private/image/_SCH6057_c_Scholvien_PSR_SC_STD_V2_DL_PPT_0.jpg?h=32462309&itok=Xi0CMgn5',
    'Reykjavik' : 'https://media-cdn.tripadvisor.com/media/photo-s/0b/4a/09/bf/caption.jpg',
    'Auckland' : 'https://farm1.nzstatic.com/_proxy/imageproxy_1y/serve/the-city-by-night.jpg?focalpointx=50&focalpointy=50&height=300&outputformat=jpg&quality=75&source=363346&transformationsystem=focalpointcrop&width=620&securitytoken=B7E3EA8000C5CB4AC932747F899B2C78' 
}

//load saved module 'body-parser' all when you send to data to the server, the server doesn't know how to parse the info, this module lets you parse info
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// setting the templating engine to use mustache
app.engine('mustache',mustacheExpress())
// setting the mustache pages directory
app.set('views','../views')
// set the view engine to mustache
app.set('view engine','mustache')



app.get('/', (req, res)=>{
   res.render('pages/home')
    
})

app.get('/trips', (req, res)=>{
    res.render('trips')
})

app.post('/home', (req, res)=>{

    //the code immediately below would create a new instance of the class Trip
    //set equal to the variable trip
    let tripId = guid()
    req.body.tripId = tripId
    let trip = new Trip(req.body.tripId, req.body.title, req.body.imageURL)
    //creating a new object to append to an array
    // let tripId = guid()
    // let title = req.body.title
    // let imageURL = req.body.imageURL

  // adding a new object into trips array
  trips.push(trip)
    console.log(trips)
  // render the mustache page called home with the object triplisting
  res.render('home',{tripListing : trips})
})

function validateLogin(req, res, next){
    if(req.session.username){
        next()
    } else {
        res.redirect('/login')
    }
}

//if the route begins with admin on all pages
//fire the validateLogin funciton, then next
//next is the 'middleware' part
//validate login does not need parentheses
app.all('*/pages/', validateLogin, (req, res, next)=>{
    //if you don't call next it will never go to the next request
   next()
})

app.get('/admin/dashboard', (req, res)=>{
    if(req.session.username){

    res.render('admin/dashboard')

    } else {
        res.redirect('/login')
        
    }
})


app.get('/home', (req, res)=>{
    res.render('home')
})

//calls the post method on the /deleteTrip path
app.post('/deleteTrip',function(req,res){

    let tripId = req.body.tripId

    // give me all the trips where the tripId is
    // not the one passed in the request
    trips = trips.filter(function(trip){
      return trip.tripId != tripId
    })
    
    res.render('home',{tripListing : trips})
  
  })




app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login', (req, res)=>{
    let username = req.body.username
    let password = req.body.password

    //validate that the username and password match
    console.log(req.session.username)
    if(req.session){
        req.session.username = username
    }

    res.redirect('/home', {tripListing : trips})
})



// get the guid
function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  
  
  app.listen(3000, () => console.log('Example app listening on port 3000!'))