let async = require('async');
const { body,validationResult, query } = require('express-validator/check');
const { sanitizeBody, sanitizeQuery } = require('express-validator/filter');
const dbquery = function (sql, values) {
    return new Promise((resolve, reject) => {
        db.query(sql,values, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        });
    })
};

var cards = [];
var companyList = [];



var fName;
var lName;
var username;
var password;
var cpassword;
exports.user_register_get = function(req, res, next) {
    //var sql = "get login info"
    fName = null;
    lName = null;
    username = null;
    password = null;
    cpassword = null;
    res.render('user_register', {title: "User Register", fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
};

exports.user_register_post = [
    // validate fields
    body('fName', 'First name must not be empty.').isLength({ min: 1 }).trim(),
    body('lName', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
    body('username', 'User name must not be empty.').isLength({ min: 1 }).trim(),
    body('password', 'Password must not be empty.').isLength({ min: 1 }).trim(),
    body('cpassword', 'Confirm password must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeQuery('*').escape(),

    (req, res, next) => {
        fName = req.body.fName;
        lName = req.body.lName;
        username = req.body.username;
        password = req.body.password;
        cpassword = req.body.cpassword;
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // if have logic errors
        if (!errors.isEmpty()) {

            res.render('user_register', {title: "Wrong info typed!", fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: errors.array()});

        } else {
            var users = [];
            var query = "select distinct username from user"
            db.query(query, [], (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                console.log("successfully get the user names!");
                users = results;
                for (var i = 0; i < users.length; i++) {
                    if (users[i]['username'] == username) {
                        res.render('user_register', {title: "User name has been used!", fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
                        break;
                    }
                }
            });
            //console.log(users);
            if (password.length < 8) {
                //console.log(password.length)
                res.render('user_register', {title: "Password must be at least 8 characters!", fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
            } else if (password!==cpassword) {
                //console.log(password);
                //console.log(cpassword);
                res.render('user_register', {title: "Confirm password and password must be same!", fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
            } else {
                console.log(req.body);
                var sql = "call user_register(?, ?, ?, ?)";
                db.query(sql, [username, password, fName, lName], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    res.redirect('/login');
                });
            }

        }
    }
];


var fName;
var lName;
var username;
var password;
var cpassword;
exports.customer_register_get = async function(req, res, next) {
    cards = [];
    fName = null;
    lName = null;
    username = null;
    password = null;
    cpassword = null;
    res.render('customer_register', {title: "Customer Register", data:cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});

};

exports.customer_register_post = [

    // validate fields
    body('fName', 'First name must not be empty.').isLength({ min: 1 }).trim(),
    body('lName', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
    body('username', 'User name must not be empty.').isLength({ min: 1 }).trim(),
    body('password', 'Password must not be empty.').isLength({ min: 1 }).trim(),
    body('cpassword', 'Confirm password must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeQuery('*').escape(),

    async (req, res, next) => {
        fName = req.body.fName;
        lName = req.body.lName;
        username = req.body.username;
        password = req.body.password;
        cpassword = req.body.cpassword;
        var select = req.body.select;
        console.log(select);
        if (select == 'register') {
            // Extract the validation errors from a request.
            const errors = validationResult(req);

            // if have logic errors
            if (!errors.isEmpty()) {
                cards = [];
                res.render('customer_register', {title: "Wrong info typed!", data:cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: errors.array()});

            } else {
                var users = [];
                var query = "select distinct username from user"
                db.query(query, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    console.log("successfully get the user names!");
                    users = results;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i]['username'] == username) {
                            res.render('customer_register', {title: "User name has been used!", data:cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
                            break;
                        }
                    }
                });
                console.log(cards);

                //console.log(users);
                if (password.length < 8) {
                    //console.log(password.length)
                    res.render('customer_register', {title: "Password must be at least 8 characters!", data:cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
                } else if (password!==cpassword) {
                    //console.log(password);
                    //console.log(cpassword);
                    res.render('customer_register', {title: "Confirm password and password must be same!", data:cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
                } else if (cards.length == 0) {
                    res.render('customer_register', {title: "You must enter a credit card!", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
                } else {
                    console.log(req.body);
                    var sql = "call customer_only_register(?, ?, ?, ?)";
                    db.query(sql, [username, password, fName, lName], (error, results, fields) => {
                        if (error) {
                            return console.error(error.message);
                        }
                        //res.redirect('/login');
                    });
                    if (cards.length != 0) {
                        var sql = "call customer_add_creditcard(?, ?)";
                        for (var i = 0; i < cards.length; i++) {
                            db.query(sql, [username, cards[i]], (error, results, fields) => {
                                if (error) {
                                    return console.error(error.message);
                                }
                            });
                        }
                    }
                    cards = [];
                    res.redirect('/login');
                }

            }
        } else if (select == 'add'){

            var num = req.body.cardNumber;
            if (cards.length == 5) {
                res.render('customer_register', {title: "You can only add 5 credit cards!", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
            } else if(num.length != 16) {
                res.render('customer_register', {title: "Credit card number must be 16 digits!", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
            } else if(cards.includes(num)){
                res.render('customer_register', {title: "This card has been added!", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
            } else {
                /*var err = false;
                var cardNums = [];
                var query2 = "select CreditCardNum from creditcard"
                db.query(query2, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    console.log("successfully get the card numbers!");
                    cardNums = results;
                    console.log(cards);
                    for (var i = 0; i < cardNums.length; i++) {
                            //console.log(cardNums[i]['CreditCardNum']);
                            //console.log(cardNums[0]['CreditCardNum']);
                        //console.log(cards[j]);
                        if (cardNums[i]['CreditCardNum'] == num) {
                            console.log("found")
                            //res.render('customer_register', {title: "Card number has been used!",  data:cards, errors: []});
                            err = true;
                            console.log(err);
                            break;
                        }
                    }
                })*/
                //console.log(err);
                var cardNums = [];
                var query2 = "select CreditCardNum from creditcard;";
                var results = await dbquery(query2, []);
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    if (!cardNums.includes(results[i]['CreditCardNum'])) {
                        cardNums.push(results[i]['CreditCardNum']);
                    }
                }
                //console.log(cardNums);
                var err = false;
                for (var i = 0; i < cardNums.length; i++) {
                    if (cardNums[i] == num) {
                        err = true;
                        break;
                    }
                }
                if (err) {
                    console.log("1");
                    res.render('customer_register', {title: "Card number has been used!", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
                } else {
                    cards.push(num);
                    console.log(cards);
                    console.log("2");
                    res.render('customer_register', {title: "Customer Register", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
                };

            }


        } else if (select == 'remove0'){
            cards.splice(0, 1);
            res.render('customer_register', {title: "Customer Register", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
        } else if (select == 'remove1'){
            cards.splice(1, 1);
            res.render('customer_register', {title: "Customer Register", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
        } else if (select == 'remove2'){
            cards.splice(2, 1);
            res.render('customer_register', {title: "Customer Register", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
        } else if (select == 'remove3'){
            cards.splice(3, 1);
            res.render('customer_register', {title: "Customer Register", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
        } else if (select == 'remove4'){
            cards.splice(4, 1);
            res.render('customer_register', {title: "Customer Register", data: cards, fname: fName, lname:lName, username:username, password:password, cpassword:cpassword, errors: []});
        } else {

        };

    }
];


var fName;
var lName;
var username;
var password;
var cpassword;
var company;
var street;
var city;
var state;
var zipcode;
exports.manager_register_get = function(req, res, next) {
    fName = null;
    lName = null;
    username = null;
    password = null;
    cpassword = null;
    company = null;
    street = null;
    city = null;
    state = null;
    zipcode = null;
    var sql = "Select Name from company";
    //var company = [];
    db.query(sql, [], (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log("successfully retrieved the company list!");
        //console.log(results);
        // console.log(results.length);
        companyList = results;
        //console.log(movies);
        res.render('manager_register', {title: "Manager-Only Register", companyList: companyList, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
    });

};

exports.manager_register_post = [
    body('fName', 'First name must not be empty.').isLength({ min: 1 }).trim(),
    body('lName', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
    body('username', 'User name must not be empty.').isLength({ min: 1 }).trim(),
    body('password', 'Password must not be empty.').isLength({ min: 1 }).trim(),
    body('cpassword', 'Confirm password must not be empty.').isLength({ min: 1 }).trim(),
    body('company', 'Company must not be empty.').isLength({ min: 1 }).trim(),
    body('street', 'Street address must not be empty.').isLength({ min: 1 }).trim(),
    body('city', 'City must not be empty.').isLength({ min: 1 }).trim(),
    body('state', 'state must not be empty.').isLength({ min: 1 }).trim(),
    body('zipcode', 'Zipcode must not be empty.').isLength({ min: 1 }).trim(),


    // Sanitize fields (using wildcard).
    sanitizeQuery('*').escape(),

    async (req, res, next) => {
        fName = req.body.fName;
        lName = req.body.lName;
        username = req.body.username;
        password = req.body.password;
        cpassword = req.body.cpassword;
        company = req.body.company;
        street = req.body.street;
        city = req.body.city;
        state = req.body.state;
        zipcode = req.body.zipcode;
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // if have logic errors
        if (!errors.isEmpty()) {

            res.render('manager_register', {title: "Wrong info typed!", companyList: companyList, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: errors.array()});

        } else {
            var address = street + city + state + zipcode;
            console.log(address);

            //var haveError = false;
            var users = [];
            var query = "select distinct username from user";
            db.query(query, [], (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                console.log("successfully get the user names!");
                users = results;
                for (var i = 0; i < users.length; i++) {
                    if (users[i]['username'] == username) {
                        //haveError = true;
                        res.render('manager_register', {title: "User name has been used!", companyList: companyList, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                        break;
                    }
                }
            });
            /*var addresses = []
            var query2 = "select Street, City, State, Zipcode from manager";
            db.query(query2, [], (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                console.log("successfully get the address!");
                addresses = results;
                //console.log(addresses);
                for (var i = 0; i < addresses.length; i++) {
                    var place = addresses[i]['Street'] + addresses[i]['City'] + addresses[i]['State'] + addresses[i]['Zipcode'];
                    //console.log(place);
                    if (address == place) {
                        haveError = true;
                        //console.log("found");
                        res.render('manager_register', {title: "Address has been used!", company: companyList, errors: []});
                        return;
                    }
                }
            });*/
            var addresses = [];
            var query2 = "select Street, City, State, Zipcode from manager;";
            var results = await dbquery(query2, []);
            console.log(results);
            for (var i = 0; i < results.length; i++) {

                addresses.push(results[i]['Street'] + results[i]['City'] + results[i]['State'] + results[i]['Zipcode']);

            }
            console.log(addresses);
            var err = false;
            for (var i = 0; i < addresses.length; i++) {
                if (addresses[i] == address) {
                    err = true;
                    break;
                }
            }

            //console.log(users);
            if (err == false) {
                if (password.length < 8) {
                    //console.log(password.length)
                    res.render('manager_register', {title: "Password must be at least 8 characters!", companyList: companyList, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                } else if (zipcode.length != 5){
                    res.render('manager_register', {title: "Zipcode must be 5 digits!", companyList: companyList, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                } else if (password!==cpassword) {
                    //console.log(password);
                    //console.log(cpassword);
                    res.render('manager_register', {title: "Confirm password and password must be same!", companyList: companyList, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                } else {
                    console.log(req.body);
                    var sql = "call manager_only_register(?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    db.query(sql, [username, password, fName, lName, company, street, city, state, zipcode], (error, results, fields) => {
                        if (error) {
                            return console.error(error.message);
                        }
                        res.redirect('/login');
                    });
                }
            } else {
                res.render('manager_register', {title: "Address has been used!", companyList: companyList, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
            }
        }
    }
];


var fName;
var lName;
var username;
var password;
var cpassword;
var company;
var street;
var city;
var state;
var zipcode;
exports.mc_register_get = function(req, res, next) {
    cards = [];
    fName = null;
    lName = null;
    username = null;
    password = null;
    cpassword = null;
    company = null;
    street = null;
    city = null;
    state = null;
    zipcode = null;
    var sql = "Select Name from company";
    //var company = [];
    db.query(sql, [], (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log("successfully retrieved the company list!");
        //console.log(results);
        // console.log(results.length);
        companyList = results;
        //console.log(movies);
        res.render('mc_register', {title: "Manager-Customer Register", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
    });

};

exports.mc_register_post = [
    body('fName', 'First name must not be empty.').isLength({ min: 1 }).trim(),
    body('lName', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
    body('username', 'User name must not be empty.').isLength({ min: 1 }).trim(),
    body('password', 'Password must not be empty.').isLength({ min: 1 }).trim(),
    body('cpassword', 'Confirm password must not be empty.').isLength({ min: 1 }).trim(),
    body('company', 'Company must not be empty.').isLength({ min: 1 }).trim(),
    body('street', 'Street address must not be empty.').isLength({ min: 1 }).trim(),
    body('city', 'City must not be empty.').isLength({ min: 1 }).trim(),
    body('state', 'state must not be empty.').isLength({ min: 1 }).trim(),
    body('zipcode', 'Zipcode must not be empty.').isLength({ min: 1 }).trim(),


    // Sanitize fields (using wildcard).
    sanitizeQuery('*').escape(),

    async (req, res, next) => {
        var select;
        fName = req.body.fName;
        lName = req.body.lName;
        username = req.body.username;
        password = req.body.password;
        cpassword = req.body.cpassword;
        company = req.body.company;
        street = req.body.street;
        city = req.body.city;
        state = req.body.state;
        zipcode = req.body.zipcode;
        select = req.body.select;
        console.log(select);
        if (select == 'register') {
            // Extract the validation errors from a request.
            const errors = validationResult(req);

            // if have logic errors
            if (!errors.isEmpty()) {

                res.render('mc_register', {title: "Wrong info typed!", companyList: companyList, data:cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: errors.array()});

            } else {

                var address = street + city + state + zipcode;
                console.log(address);

                //var haveError = false;

                var users = [];
                var query = "select distinct username from user";
                db.query(query, [], (error, results, fields) => {
                    if (error) {
                        return console.error(error.message);
                    }
                    console.log("successfully get the user names!");
                    users = results;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i]['username'] == username) {
                            //haveError = true;
                            res.render('mc_register', {title: "User name has been used!", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                            break;
                        }
                    }
                });
                var addresses = [];
                var query2 = "select Street, City, State, Zipcode from manager;";
                var results = await dbquery(query2, []);
                console.log(results);
                for (var i = 0; i < results.length; i++) {

                    addresses.push(results[i]['Street'] + results[i]['City'] + results[i]['State'] + results[i]['Zipcode']);

                }
                console.log(addresses);
                var err = false;
                for (var i = 0; i < addresses.length; i++) {
                    if (addresses[i] == address) {
                        err = true;
                        break;
                    }
                }

                //console.log(users);
                if (err == false) {
                    if (password.length < 8) {
                        //console.log(password.length)
                        res.render('mc_register', {title: "Password must be at least 8 characters!", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                    } else if (zipcode.length != 5){
                        res.render('mc_register', {title: "Zipcode must be 5 digits!", errors: []});
                    } else if (password!==cpassword) {
                        //console.log(password);
                        //console.log(cpassword);
                        res.render('mc_register', {title: "Confirm password and password must be same!", companyList: companyList, data:cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                    } else if (cards.length == 0) {
                        res.render('mc_register', {title: "You must enter a credit card!", data: cards, companyList: companyList, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                    } else {
                        console.log(req.body);
                        var sql = "call manager_customer_register(?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        db.query(sql, [username, password, fName, lName, company, street, city, state, zipcode], (error, results, fields) => {
                            if (error) {
                                return console.error(error.message);
                            }
                            //res.redirect('/login');
                        });
                        if (cards.length != 0) {
                            var sql = "call manager_customer_add_creditcard(?, ?)";
                            for (var i = 0; i < cards.length; i++) {
                                db.query(sql, [username, cards[i]], (error, results, fields) => {
                                    if (error) {
                                        return console.error(error.message);
                                    }
                                });
                            }
                        }
                        cards = [];
                        res.redirect('/login');
                    }
                } else {
                    res.render('mc_register', {title: "Address has been used!", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                }


            }
        } else if (select == 'add'){

            var num = req.body.cardNumber;
            if (cards.length == 5) {
                res.render('mc_register', {title: "You can only add 5 credit cards!", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
            } else if(num.length != 16) {
                res.render('mc_register', {title: "Credit card number must be 16 digits!", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
            } else if(cards.includes(num)){
                res.render('mc_register', {title: "This card has been added!", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
            } else {

                //console.log(err);
                var cardNums = [];
                var query2 = "select CreditCardNum from creditcard;";
                var results = await dbquery(query2, []);
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    if (!cardNums.includes(results[i]['CreditCardNum'])) {
                        cardNums.push(results[i]['CreditCardNum']);
                    }
                }
                //console.log(cardNums);
                var err = false;
                for (var i = 0; i < cardNums.length; i++) {
                    if (cardNums[i] == num) {
                        err = true;
                        break;
                    }
                }
                if (err) {
                    console.log("1");
                    res.render('mc_register', {title: "Card number has been used!", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                } else {
                    cards.push(num);
                    console.log(cards);
                    console.log("2");
                    res.render('mc_register', {title: "Manager-Customer Register", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
                };

            }

        } else if (select == 'remove0'){
            cards.splice(0, 1);
            res.render('mc_register', {title: "Manager-Customer Register", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
        } else if (select == 'remove1'){
            cards.splice(1, 1);
            res.render('mc_register', {title: "Manager-Customer Register", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
        } else if (select == 'remove2'){
            cards.splice(2, 1);
            res.render('mc_register', {title: "Manager-Customer Register", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
        } else if (select == 'remove3'){
            cards.splice(3, 1);
            res.render('mc_register', {title: "Manager-Customer Register", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
        } else if (select == 'remove4'){
            cards.splice(4, 1);
            res.render('mc_register', {title: "Manager-Customer Register", companyList: companyList, data: cards, fname:fName, lname:lName, username:username, password:password, cpassword:cpassword, company:company, street:street, city:city, state:state, zipcode:zipcode, errors: []});
        } else {

        };

    }
];