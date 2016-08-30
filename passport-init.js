var LocalStrategy = require('passport-local').Strategy;

var bCrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose');

var User = mongoose.model('User');
var Post = mongoose.model('Post');


module.exports = function (passport) {
    //passport needs to be able to serialize and deserialize users 
    passport.serializeUser(function (user, done) {
        console.log("Serializing user: ", user._id);
        // attach the user._id to the session
        // saved to session req.session.passport.user = {_id:'....'}

        return done(null, user._id);
    });

    passport.deserializeUser(function (_id, done) {
        console.log("Attempt to deserialize user " + _id);
        User.findById(_id, function (err, user) {
            if (err) {
                console.log(err);
                return done(err, false);
            }
            else if (!user) {
                return done('User not found', false);
            }
            else {
                // user found, provide it back to passport
                return done(null, user);
            }
        });
    });

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                else if (!user) {
                    //if there is no user with this username
                    return done(null, false);
                }
                else if (!isValidPassword(user, password)) {
                    //wrong password
                    return done(null, false);
                }
                else {
                    // successfully log in
                    return done(null, user);
                }
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {
            console.log("I got a sign up request !");
            User.findOne({ username: username }, function (err, docs) {
                if (err) {
                    return done(err);
                }
                else if (docs) {
                    // this username already exists
                    return done(null, false);
                }
                else {
                    var user = new User();
                    user.username = username;
                    user.password = createHash(password);

                    user.save(function (err, user) {
                        if (err)
                            {
                                console.log("Error saving user: "+user.username);
                                throw err
                            }
                        return done(null, user);
                    });

                }
            });
        }));

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };

    // generate hash using bCrypt

    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };



}