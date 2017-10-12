#!/usr/bin/env node

'use strict';

var express = require('express');
var logger = require('morgan');

var path = require('path');
var qs = require('querystring');

var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var jwt = require('jwt-simple');
var moment = require('moment');
var request = require('request');
var mongoose = require('mongoose');
var Mixed = mongoose.Schema.Types.Mixed;

var userSchema = new mongoose.Schema({
  email: { type: String, lowercase: true },
  password: String,
  displayName: String,
  picture: String,
  facebook:{
    id: String,
    email: String,
    picture: String,
    displayName: String,
    about: String,
    age_range: Mixed,
    birthday: String,
    education: Mixed,
    favorite_athletes: Mixed,
    gender: String,
    hometown: Mixed,
    inspirational_people: Mixed,
    interested_in: Mixed,
    languages: Mixed,
    meeting_for: Mixed,
    political: Mixed,
    quotes: Mixed,
    relationship_status: String,
    religion: String,
    sports: Mixed,
    website: Mixed,
    work: Mixed,

    source: String,
    username: String,
    customTags: [String],
    activationDate: Date,
    followers: Number,
    followings: Number,
    language: String,
    location: String,
    latitude: Number,
    longitude: Number,
    connections: [String]
  },
  linkedin:{
    id: String,
    email: String,
    picture: String,
    displayName: String,
    location : String,
    industry : String,
    num_connections : String,
    summary: String,
    specialties: String,
    associations: String,
    interests: String,
    patents: String,
    skills: String,
    certifications: String,
    educations: String,
    courses: String,
    volunteer: String,
    num_recommenders: String,
    date_of_birth: String,
    honors_awards: String,

    source: String,
    username: String,
    customTags: [String],
    activationDate: Date,
    followers: Number,
    followings: Number,
    language: String,
    latitude: Number,
    longitude: Number,
    connections: [String]


  },
  twitter: {
    id: String,
    email: String,
    picture: String,
    displayName: String,
    description: String,
    favorites_count: Number,
    location: String,
    screen_name: String,
    statuses_count: String,
    url: String,

    source: String,
    username: String,
    customTags: [String],
    activationDate: Date,
    followers: Number,
    followings: Number,
    language: String,
    latitude: Number,
    longitude: Number,
    connections: [String]
  }
});


userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});


userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var twitter = new mongoose.Schema({
    id: String,
    email: String,
    picture: String,
    displayName: String,
    description: String,
    favorites_count: Number,
    location: String,
    screen_name: String,
    statuses_count: String,
    url: String,

    source: String,
    username: String,
    customTags: [String],
    activationDate: Date,
    followers: Number,
    followings: Number,
    language: String,
    latitude: Number,
    longitude: Number,
    connections: [String]
});

var facebook = new mongoose.Schema({
    id: String,
    email: String,
    picture: String,
    displayName: String,
    about: String,
    age_range: Mixed,
    birthday: String,
    education: Mixed,
    favorite_athletes: Mixed,
    gender: String,
    hometown: Mixed,
    inspirational_people: Mixed,
    interested_in: Mixed,
    languages: Mixed,
    meeting_for: Mixed,
    political: Mixed,
    quotes: Mixed,
    relationship_status: String,
    religion: String,
    sports: Mixed,
    website: Mixed,
    work: Mixed,
    language: String,

    source: String,
    username: String,
    customTags: [String],
    activationDate: Date,
    followers: Number,
    followings: Number,
    location: String,
    latitude: Number,
    longitude: Number,
    connections: [String]
});

var linkedin = new mongoose.Schema({
    id: String,
    email: String,
    picture: String,
    displayName: String,
    location : String,
    industry : String,
    num_connections : String,
    summary: String,
    specialties: String,
    associations: String,
    interests: String,
    patents: String,
    skills: String,
    certifications: String,
    educations: String,
    courses: String,
    volunteer: String,
    num_recommenders: String,
    date_of_birth: String,
    honors_awards: String,

    source: String,
    username: String,
    customTags: [String],
    activationDate: Date,
    followers: Number,
    followings: Number,
    language: String,
    latitude: Number,
    longitude: Number,
    connections: [String]
});


var MessageSchema =new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  oId: String,
  text: String,
  story: String,
  source: String,
  fromUser: String,
  toUsers: [String],
  refUsers: [String],
  date: Date,
  parent: String,
  customTags: [String],
  language: String,
  latitude: Number,
  longitude: Number,
  favs: Number,
  shares: Number,
  tags: [{
      sources: [String],
      language: String,
      categories: {
          text: String,
          stopWord: Boolean
        },
      stopWord: Boolean
  }],
  tokens: [{
      text: String,
      pos: String,
      simplePos: String,
      stopWord: Boolean,
      lemma: String,
      score: Number
    }],
  sentiment: Number,
  number_cluster: Number,
  cluster_kmeans: Number
});

MessageSchema.pre('save', function(next) {
  var self = this;
    Message.find({text : self.text, displayName: self.displayName, source: self.source}, function (err, docs) {
        if (!docs.length){
            next();
        }else{
            console.log('user exists: ',self.text);
            next(new Error("Text exists!"));
        }
    });
});



var connection = mongoose.createConnection();

var arg = ['localhost','profiles'];

connection.open.apply(connection, arg);

connection.on('error', function(err) {
  console.log(err);
});

var User = connection.model('Profile', userSchema, 'Profile');
var Message = connection.model('Message', MessageSchema, 'Message');
var Like = connection.model('Like', MessageSchema, 'Like');



var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}


/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, '4EKxGhcqvaNtkZM0s5TehZvzgqb6nrQx');
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, '4EKxGhcqvaNtkZM0s5TehZvzgqb6nrQx');
}


// if config.json is missing, use environment variables
var jsonConfig;
try {
  jsonConfig = require('../dist/config.json');
} catch (Error) {
  jsonConfig = {
    api: process.env.CROWD_PULSE_UI_API,
    socket: process.env.CROWD_PULSE_UI_SOCKET,
    index: process.env.CROWD_PULSE_UI_INDEX
  };
}


/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {


    var connection = mongoose.createConnection();

    var arg = ['localhost', user.displayName];
    connection.open.apply(connection, arg);
    connection.on('error', function(err) {
      console.log(err);
    });

    var Message = connection.model('Message', MessageSchema, 'Message');
    var Like = connection.model('Like', MessageSchema, 'Like');

    Message.find({source: 'twitter_' + user.id}, function(err, tweets){

        Message.find({source: 'facebook_' + user.id, text: {$exists: true}}, function(err, face_posts){


            Like.find({source: 'facebook_' + user.id}, function(err, face_likes){
                var user_message= {user: user, tweets: tweets, face_posts:face_posts, face_likes:face_likes};
                res.send(user_message);
            });

        });
    });

  });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
app.put('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, 'password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }
      res.send({ token: createJWT(user) });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/auth/signup', function(req, res) {
  User.findOne({ displayName: req.body.displayName }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Username is already taken' });
    }
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'Email is already taken' });
        }
        var dn = req.body.displayName;
        dn = dn.replace(" ", "_");
        var user = new User({
          displayName: dn,
          email: req.body.email,
          password: req.body.password
        });
        user.save(function(err, result) {
          if (err) {
            res.status(500).send({ message: err.message });
          }
          res.send({ token: createJWT(result) });
        });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 | Note: Make sure "Request email addresses from users" is enabled
 | under Permissions tab in your Twitter app. (https://apps.twitter.com)
 |--------------------------------------------------------------------------
 */
app.post('/auth/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
  var get_status='https://api.twitter.com/1.1/statuses/user_timeline.json?count=1000';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: 'j7YNGim3eJWEBU2yN8Ab6tcGI',
      consumer_secret: '34r9VXTmTiVYVmHsGpSBjD2bcKREvKlG1GivOKcaMQgcNhvcpU',
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: 'j7YNGim3eJWEBU2yN8Ab6tcGI',
      consumer_secret: '34r9VXTmTiVYVmHsGpSBjD2bcKREvKlG1GivOKcaMQgcNhvcpU',
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: 'j7YNGim3eJWEBU2yN8Ab6tcGI',
        consumer_secret: '34r9VXTmTiVYVmHsGpSBjD2bcKREvKlG1GivOKcaMQgcNhvcpU',
        token: accessToken.oauth_token,
        token_secret: accessToken.oauth_token_secret,
      };

      // Step 4. Retrieve user's profile information and email address.
      request.get({
        url: profileUrl,
        qs: { include_email: true },
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {
        // Step 5a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({ 'twitter.id' : profile.id }, function(err, existingUser) {


            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, '4EKxGhcqvaNtkZM0s5TehZvzgqb6nrQx');

            User.findById(payload.sub, function(err, user) {

                if (!user) {
                    return res.status(400).send({ message: 'User not found' });
                }

                ////////////////
                var connection_user = mongoose.createConnection();
                var arg = ['localhost', user.displayName];

                connection_user.open.apply(connection_user, arg);
                connection_user.on('error', function(err) {
                  console.log(err);
                });


                var User_profile = connection_user.model('Profile', twitter, 'Profile');
                var user_profile = new User_profile();
                var Message_profile = connection_user.model('Message', MessageSchema, 'Message');

                User_profile.remove({'id': profile.id}, function(err, removed){});

                /////////////////////////
                user.twitter.id = profile.id;
                user.twitter.email = profile.email;
                user.twitter.displayName = profile.name;
                user.twitter.picture = profile.profile_image_url_https.replace('_normal', '');
                user.twitter.description = profile.description;
                user.twitter.favorites_count = profile.favorites_count;
                user.twitter.location = profile.location;
                user.twitter.screen_name = profile.screen_name;
                user.twitter.statuses_count = profile.statuses_count;
                user.twitter.url = profile.url;

                user.twitter.source = "profiler";
                user.twitter.username = profile.name;
                user.twitter.followers = profile.followers_count;
                user.twitter.followings = profile.friends_count;
                user.twitter.language = profile.lang;


                user.save(function(err) {
                    res.send({ token: createJWT(user) });
                });

                user_profile.id = profile.id;
                user_profile.email = profile.email;
                user_profile.displayName = profile.name;
                user_profile.picture = profile.profile_image_url_https.replace('_normal', '');
                user_profile.description = profile.description;
                user_profile.favorites_count = profile.favorites_count;
                user_profile.location = profile.location;
                user_profile.screen_name = profile.screen_name;
                user_profile.statuses_count = profile.statuses_count;
                user_profile.url = profile.url;

                user_profile.source = "profiler";
                user_profile.username = profile.name;
                user_profile.followers = profile.followers_count;
                user_profile.followings = profile.friends_count;
                user_profile.language = profile.lang;

                user_profile.save(function(err) { });


                request.get({
                    url: get_status,
                    oauth: profileOauth,
                    json: true
                  }, function(err, response, statuses) {

                        for (var i = 0; i < statuses.length; i++){

                            var obj = statuses[i];
                            var d = new Date(obj.created_at).toISOString();

                            var message = new Message();
                            var message_profile = new Message_profile();

                            message.oId = obj.id;
                            message.text = obj.text;
                            message.source = 'twitter_' + user.id;
                            message.fromUser = obj.user.screen_name;
                            message.date = d;
                            message.language = obj.lang;
                            message.favs = obj.favorite_count;
                            message.shares = obj.shares_count;

                            message.save();


                            message_profile.oId = obj.id;
                            message_profile.text = obj.text;
                            message_profile.source = 'twitter_' + user.id;
                            message_profile.fromUser = obj.user.screen_name;
                            message_profile.date = d;
                            message_profile.language = obj.lang;
                            message_profile.favs = obj.favorite_count;
                            message_profile.shares = obj.shares_count;

                            message_profile.save();
                        }
                  });
            });
          });
        }
      });
    });
  }
});



/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
app.post('/auth/facebook', function(req, res) {

  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'about', 'age_range', 'birthday', 'education', 'favorite_athletes', 'favorite_teams', 'gender', 'hometown', 'inspirational_people', 'interested_in','languages', 'meeting_for', 'political', 'quotes', 'relationship_status', 'religion', 'sports', 'website', 'work','posts.limit(1000)','likes.limit(1000)'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: '7ce264e7a782298475830477d9442bc6',
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {

    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {

      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header('Authorization')) {

        User.findOne({}, function(err, existingUser) {

          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, '4EKxGhcqvaNtkZM0s5TehZvzgqb6nrQx');
          User.findById(payload.sub, function(err, user) {

            //////////////


            var connection_user = mongoose.createConnection();
            var arg = ['localhost', user.displayName];

            connection_user.open.apply(connection_user, arg);
            connection_user.on('error', function(err) {
               console.log(err);
            });

	        var User_profile = connection_user.model('Profile', facebook, 'Profile');
            var user_profile = new User_profile();

            var Message_profile = connection_user.model('Message', MessageSchema, 'Message');
            var Like_profile = connection_user.model('Like', MessageSchema, 'Like');


            User_profile.remove({'id': profile.id}, function(err, removed){});


            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }


            user.facebook.id = profile.id;
            user.facebook.picture = 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.facebook.displayName = profile.name;


            user.facebook.about = profile.about;
            user.facebook.age_range = profile.age_range;
            user.facebook.birthday = profile.birthday;
            user.facebook.education = profile.education;
            user.facebook.favorite_athletes = profile.favorite_athletes;

            user.facebook.favorite_teams = profile.favorite_teams;

            user.facebook.gender = profile.gender;
	        user.facebook.hometown = profile.hometown;
	        user.facebook.inspirational_people = profile.inspirational_people;
            user.facebook.interested_in = profile.interested_in;
            user.facebook.languages = profile.languages;
            user.facebook.meeting_for = profile.meeting_for;
            user.facebook.political = profile.political;
            user.facebook.quotes = profile.quotes;
            user.facebook.relationship_status = profile.relationship_status;
            user.facebook.religion = profile.religion;
            user.facebook.sports = profile.sports;
            user.facebook.website = profile.website;
            user.facebook.work = profile.work;

            user.facebook.language = profile.languages[0].name.substr(0,2).toLowerCase();;
            user.facebook.username = profile.name;


            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });




	        user_profile.id = profile.id;
            user_profile.picture = 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user_profile.displayName = profile.name;


            user_profile.about = profile.about;
            user_profile.age_range = profile.age_range;
            user_profile.birthday = profile.birthday;
            user_profile.education = profile.education;
            user_profile.favorite_athletes = profile.favorite_athletes;

            user_profile.favorite_teams = profile.favorite_teams;

            user_profile.gender = profile.gender;
	        user_profile.hometown = profile.hometown;
	        user_profile.inspirational_people = profile.inspirational_people;
            user_profile.interested_in = profile.interested_in;
            user_profile.languages = profile.languages;
            user_profile.meeting_for = profile.meeting_for;
            user_profile.political = profile.political;
            user_profile.quotes = profile.quotes;
            user_profile.relationship_status = profile.relationship_status;
            user_profile.religion = profile.religion;
            user_profile.sports = profile.sports;
            user.facebook.website = profile.website;
            user_profile.work = profile.work;
            user_profile.language = profile.languages[0].name.substr(0,2).toLowerCase();;
            user_profile.username = profile.name;

  	        user_profile.save(function(err) { });


            if (typeof profile.posts !== 'undefined') { // profile has posts

                var l = 'it';

                if(typeof profile.languages !== 'undefined')
                    l = profile.languages[0].name.substr(0,2).toLowerCase();

                for (var i = 0; i < profile.posts.data.length; i++){
                    var message = new Message();
                    var message_profile = new Message_profile();



                    var obj = profile.posts.data[i];

                    if(typeof obj.message !== 'undefined'){
                        message.text = obj.message;
                        message_profile.text = obj.message;

                        message.story = obj.story;
                        message_profile.story = obj.story;


                        message.language = l;
                        message_profile.language = l;


                        message.oId = obj.id;
                        message.source = 'facebook_' + user.id;
                        message.fromUser = profile.name;
                        message.date = obj.created_time;

                        message_profile.oId = obj.id;
                        message_profile.source = 'facebook_' + user.id;
                        message_profile.fromUser = profile.name;
                        message_profile.date = obj.created_time;

                        message.save(function(err) {});
                        message_profile.save(function(err) {});


                    }

                }

            }


            if (typeof profile.likes !== 'undefined') { // profile has likes

                for (var i = 0; i < profile.likes.data.length; i++){

                    var like = new Like();
                    var like_profile = new Like_profile();

                    var obj = profile.likes.data[i];
                    like.text= obj.name;
                    like_profile.text = obj.name;

                    like.oId = obj.id;
                    like.source = 'facebook_' + user.id;
                    like.fromUser = profile.name;
                    like.date = obj.created_time;

                    like_profile.oId = obj.id;
                    like_profile.source = 'facebook_' + user.id;
                    like_profile.fromUser = profile.name;
                    like_profile.date = obj.created_time;


                    like.save(function(err) {});
                    like_profile.save(function(err) {});

                }

            }
          });
        });
      }
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Login with LinkedIn
 |--------------------------------------------------------------------------
 */
app.post('/auth/linkedin', function(req, res) {
  var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url,location,industry,num-connections,summary,specialties,positions,associations,interests,patents,skills,certifications,educations,courses,volunteer,num-recommenders,following,date-of-birth,honors-awards)';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: 'IgFP60GaF2Sa8jzD',
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({ message: body.error_description });
    }
    var params = {
      oauth2_access_token: body.access_token,
      format: 'json'
    };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a LinkedIn account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, '4EKxGhcqvaNtkZM0s5TehZvzgqb6nrQx');
          User.findById(payload.sub, function(err, user) {


            ///////////////////

            var connection_user = mongoose.createConnection();
            var arg = ['localhost', user.displayName + '_' + payload.sub];

            connection_user.open.apply(connection_user, arg);
            connection_user.on('error', function(err) {
               console.log(err);
            });

	        var User_profile = connection_user.model('Profile', linkedin, 'Profile');
            var user_profile = new User_profile();
            User_profile.remove({'id': profile.id}, function(err, removed){});

            /////////////////

            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }




            user.linkedin.id = profile.id;
            user.linkedin.picture = user.picture || profile.pictureUrl;
            user.linkedin.displayName = profile.firstName + ' ' + profile.lastName;
            user.linkedin.email = profile.email;

            user.linkedin.location = profile.location.name;
            user.linkedin.industry = profile.industry;
            user.linkedin.num_connections = profile.numConnections;
            user.linkedin.summary= profile.summarys;
            user.linkedin.specialties = profile.specialties;
            user.linkedin.associations = profile.associations;
            user.linkedin.interests= profile.interests;
            user.linkedin.patents= profile.patents;
            user.linkedin.skills= profile.skills;
            user.linkedin.certifications= profile.certifications;
            user.linkedin.educations= profile.educations;
            user.linkedin.courses= profile.courses;
            user.linkedin.volunteer= profile.volunteer;
            user.linkedin.num_recommenders= profile.numRecommenders;
            user.linkedin.followings= profile.following;
            user.linkedin.date_of_birth= profile.dateOfBirth;
            user.linkedin.honors_awards= profile.honorsAwards;

            user.linkedin.username = profile.firstName + ' ' + profile.lastName;


            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });


            user_profile.id = profile.id;
            user_profile.picture = user.picture || profile.pictureUrl;
            user_profile.displayName = profile.firstName + ' ' + profile.lastName;
            user_profile.email = profile.email;

            user_profile.location = profile.location.name;
            user_profile.industry = profile.industry;
            user_profile.num_connections = profile.numConnections;
            user_profile.summary= profile.summarys;
            user_profile.specialties = profile.specialties;
            user_profile.associations = profile.associations;
            user_profile.interests= profile.interests;
            user_profile.patents= profile.patents;
            user_profile.skills= profile.skills;
            user_profile.certifications= profile.certifications;
            user_profile.educations= profile.educations;
            user_profile.courses= profile.courses;
            user_profile.volunteer= profile.volunteer;
            user_profile.num_recommenders= profile.numRecommenders;
            user_profile.followings= profile.following;
            user_profile.date_of_birth= profile.dateOfBirth;
            user_profile.honors_awards= profile.honorsAwards;

            user_profile.username = profile.firstName + ' ' + profile.lastName;


            user_profile.save(function() {});



          });
        });
      }
    });
  });
});






app.get('/config.json', function (req, res) {
  res.send(jsonConfig);
});
app.use(express.static(__dirname + '/../dist'));

// start server
var server = app.listen(process.env.CROWD_PULSE_UI_PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Web app listening at %s:%s', host, port);
});

// close server on CTRL-C
process.on('SIGINT', function() {
  console.log('\nShutting down...');
  server.close();
  console.log('Clear eyes, full hearts, can\'t lose.');
  process.exit();
});
