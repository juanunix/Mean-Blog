const User = require('../Model/user');
const jwt = require('jsonwebtoken');
const Data = require('../Mongo/mongoose')
module.exports = (router) => {

    router.post('/register', (req, res) => {
        // email
        if (!req.body.email) {
            res.json({
                success: false,
                message: 'Please enter an e-mail'
            }); 

        } else {
            //username
            if (!req.body.username) {
                res.json({
                    success: false,
                    message: 'Please enter a username'
                });
            } else {
                //password
                if (!req.body.password) {
                    res.json({
                        success: false,
                        message: 'Please enter a password'
                    });
                } else {
                    //firstname
                    if (!req.body.firstname) {
                        res.json({
                            success: false,
                            message: 'Please enter a first-name'
                        });

                    } else {
                        //lastname
                        if (!req.body.lastname) {
                            res.json({
                                success: false,
                                message: 'Please enter your last-name'
                            });

                        } else {
                            //new user
                            let user = new User({
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email.toLowerCase(),
                                username: req.body.username.toLowerCase(),
                                password: req.body.password
                            });
                            // save user
                            user.save((err) => {

                                if (err) {
                                    // account exists already?
                                    if (err.code === 11000) {
                                        res.json({
                                            success: false,
                                            message: 'Username or e-mail already exists'
                                        });
                                    } else {
                                        //check errors
                                        if (err.errors) {
                                            if (err.errors.email) {
                                                res.json({
                                                    success: false,
                                                    message: err.errors.email.message
                                                });
                                            } else {
                                                if (err.errors.username) {
                                                    res.json({
                                                        success: false,
                                                        message: err.errors.username.message
                                                    });
                                                } else {
                                                    if (err.errors.password) {
                                                        res.json({
                                                            success: false,
                                                            message: err.errors.password.message
                                                        });
                                                    } else {
                                                        if (err.errors.firstname) {
                                                            res.json({
                                                                success: false,
                                                                message: err.errors.firstname.message
                                                            })

                                                        } else {
                                                            if (err.errors.lastname) {
                                                                res.json({
                                                                    success: false,
                                                                    message: err.errors.lastname.message
                                                                })
                                                            } else {
                                                                res.json({
                                                                    success: false,
                                                                    message: err
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            res.json({
                                                success: false,
                                                message: 'Could not save user ',
                                                err
                                            });
                                        }
                                    }
                                } else {
                                    res.json({
                                        success: true,
                                        message: 'Registered!'
                                    });
                                }
                            });
                        }
                    }
                }

            }
        }
    });


    router.get('/checkEmail/:email', (req, res) => {
        // is email entered 
        if (!req.params.email) {
            res.json({
                success: false,
                message: 'E-mail was not provided'
            });
        } else {
            //looking in user database
            User.findOne({
                email: req.params.email
            }, (err, user) => {
                //catch errors
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                } else {
                    if (user) {
                        res.json({
                            success: false,
                            message: 'E-mail is already taken'
                        });
                    } else {
                        res.json({
                            success: true,
                            message: 'E-mail is available'
                        });
                    }
                }
            });
        }
    });


    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({
                success: false,
                message: 'Username was not provided'
            });
        } else {
            //check in user db
            User.findOne({
                username: req.params.username
            }, (err, user) => {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                } else {
                    if (user) {
                        res.json({
                            success: false,
                            message: 'Username is already taken'
                        });
                    } else {
                        res.json({
                            success: true,
                            message: 'Username is available'
                        });
                    }
                }
            });
        }
    });


    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({
                success: false,
                message: 'No username was provided'
            });
        } else {
            if (!req.body.password) {
                res.json({
                    success: false,
                    message: 'No password was provided.'
                });
            } else {
                User.findOne({
                    username: req.body.username.toLowerCase()
                }, (err, user) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: "this hh is",
                            err
                        });
                    } else {
                        if (!user) {
                            res.json({
                                success: false,
                                message: 'Username not found.'
                            });
                        } else {
                            const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
                            if (!validPassword) {
                                res.json({
                                    success: false,
                                    message: 'Password invalid'
                                });
                            } else {
                                const token = jwt.sign({
                                    userId: user._id
                                }, Data.secret, {
                                    expiresIn: '48h'
                                });
                                res.json({
                                    success: true,
                                    message: 'Success!',
                                    token: token,
                                    user: {
                                        username: user.username
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
    });

    return router;
}