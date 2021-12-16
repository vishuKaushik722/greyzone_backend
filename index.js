//contains db and server start code

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import multer from "multer";
import path from 'path';

import otpRoutes from './routes/otp.routes.js';
import newItemRoutes from './routes/newItems.routes.js';
import newUserRoutes from './routes/v2User.routes.js';
import orderRoutes from './routes/orders.routes.js';
import posterRoutes from './routes/posters.routes.js';

dotenv.config();

//Google
import { OAuth2Client } from "google-auth-library";
import v2UserModel from "./models/v2User.model.js";
const CLIENT_ID = process.env.CLIENT_ID;

const app = express();
app.use(express.json());


app.use(bodyParser.json({limit: "30mb", extended : true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended : true}));
app.use(cors());
app.use(
    cookieSession({
        maxAge: 30*24*60*60*1000,   //time in miliseconds
        keys : [process.env.COOKIE_KEY]
    })
)

app.use(passport.initialize());
app.use(passport.session());

//Middleware
app.set('view engine','ejs');
app.use(express.json());
//Middleware

//Routes
app.use('/v1/otp', otpRoutes);
//Routes

//New Routes
app.use('/v1/newItems' , newItemRoutes); 
app.use('/v1/newUser' , newUserRoutes);
app.use('/v1/orders', orderRoutes);
app.use('/v1/posters' , posterRoutes);
//New Routes


//Image upload


// storage engine 

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000000
    }
})
app.use('/profile', express.static('upload/images'));
app.post("/upload", upload.single('profile'), (req, res) => {

    res.json({
        success: 1,
        profile_url: `http://localhost:8000/profile/${req.file.filename}`
    })
})



//Google Auth 2.0
passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET, 
        callbackURL : "/v1/auth/google/callback"
    },
    (accessToken, refreshToken, profile,done) => {

        console.log("profile", profile);

        v2UserModel.findOne({googleID : profile.id})
            .then((existingUser) => {
                if(existingUser){
                    done(null, existingUser);
                }
                else{
                    new v2UserModel({googleID : profile.id ,
                                    name : profile.displayName,
                                    email : profile.emails[0].value,
                                    photo : profile.photos[0].value}).save().then((user) => {
                        done(null,user)
                    })
                }
            })
    }
    )
)

passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser((id,done) => {
    v2UserModel.findById(id).then((user) => {
        done(null,user)
    })
})

app.get('/v1/auth/google' , passport.authenticate('google' , {
    scope : ['profile' , 'email']
}))
app.get('/v1/auth/google/callback' , passport.authenticate('google') , (req,res) => {
    res.send('Logged in Using Google');
});

app.get('/v1/auth/currentuser' , (req,res) => {
    res.send(req.user);
})

app.get('/v1/auth/logout' , (req,res) => {
    req.logout();
    res.send(req.user);
})
//Google Auth 2.0



//Check
app.get('/', (req,res) => {
    res.send('API is Working');
})
//Check

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> app.listen(PORT, () => console.log(`Server running on port : ${PORT} and connection to database is established`)))
    .catch((error) => console.log(error.message));


mongoose.set('useFindAndModify', false);


