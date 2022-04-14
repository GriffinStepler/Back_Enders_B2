const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { url } = require('inspector');

let connectionString = {
    host: "107.180.1.16",
    port: "3306",
    database: "sprog20222",
    user: "sprog20222",
    password: "sprog20222",
};

let connection = mysql.createConnection(connectionString)


const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// http://localhost:3000/
app.get('/', function(request, response) {
    
    // Render login template
    response.sendFile(path.join(__dirname + '/login.html'));
    // response.render('pages/login');
    
});

// http://localhost:3000/home
app.post('/home', function(request, response) {

    //create new connection
    function makeConnection() {
        connection = mysql.createConnection(connectionString)
        connection.connect((err, result) => {

            if (err) {
                
                if(err.code == 'ETIMEDOUT') {
                    console.log("ETIMEOUT handled in /home initial connection, refreshed page and try connection again.")
                    makeConnection()
                }
                else {
                    throw new Error(err)
                    return
                }
            } else {
                console.log('Successfully connecting with the database')
            }
        });
    }
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;

    function logUserIn(){
        // Ensure the input fields exists and are not empty
        if (username && password) {
            // Execute SQL query that'll select the account from the database based on the specified username and password
            connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) {
                    if(error.code == 'ETIMEDOUT') {
                        console.log("ETIMEOUT handled after first /home query, called logUserIn() as a recursive call.")
                        logUserIn()
                        return
                    }
                    else {
                        throw new Error(error)
                        return
                    }
                }
                // If the account exists
                if (results.length > 0) {
                    // Authenticate the user
                    console.log(results)
                    request.session.loggedin = true;
                    request.session.username = username;
                    request.session.idNum = results[0].id
                    request.session.firstName = results[0].firstName
                    request.session.lastName = results[0].lastName
                    request.session.department = results[0].department
                    request.session.tierLevel = results[0].tierLevel
                    request.session.imageRef = results[0].imageRef
                    request.session.email = results[0].email
                    request.session.linkedIn = results[0].linkedIn
                        // Redirect to home page
                        // response.redirect('/home');
                    if (request.session.loggedin) {
                        console.log('successful login by', request.session.username)

                        let accountInfo = {
                                username: username,
                                idNum: request.session.idNum,
                                firstName: request.session.firstName,
                                lastName: request.session.lastName,
                                department: request.session.department,
                                tierLevel: request.session.tierLevel,
                                imageRef: request.session.imageRef,
                                email: request.session.email,
                                linkedIn: request.session.linkedIn
                            }
                            //renders page using ejs directly after auth in order to not send headers twice
                        
                        // execute second query to retreive meetings from database
                        // calQuery separated for ease of use... holy shit this stupid thing is long
                        let calQuery = `select day, month, year, time 
                                        from meetings 
                                        join mentorship on mentorship.mentorshipID=meetings.mentorshipID 
                                        join accounts on mentorship.mentorID=accounts.id 
                                        where accounts.username='${username}' 
                                        union 
                                        select day, month, year, time
                                        from meetings 
                                        join mentorship on mentorship.mentorshipID=meetings.mentorshipID 
                                        join accounts on mentorship.menteeID=accounts.id 
                                        where accounts.username='${username}';`;
                        connection.query(calQuery, function(error, results) {
                            if (error) throw error;
                            // if the user has upcoming meetings
                            if (results.length > 0) {
                                // create list of meetings
                                // I literally have no idea if this works
                                let calInfo = [];
                                results.forEach(function(element) {
                                    calInfo.push(element);
                                });
                                response.render('pages/home', {header: username, accountInfo: accountInfo, calendar: calInfo});
                            } 
                            // if the user has no upcoming meetingsx
                            else {
                                let calInfo = [];
                                response.render('pages/home', {header: username, accountInfo: accountInfo, calendar: calInfo});
                            }
                        });

                        // this is now rendered after the calendar query
                        // response.render('pages/home', { header: username, accountInfo: accountInfo })
                    } else {
                        // Not logged in
                        let calInfo = 'No upcoming meetings!';
                        response.send("Log in to view this page!");
                    }
                    connection.end(err => {
                        if(err){
                            console.log(`${err.toString()}`)
                        }
                        })
                } else {
                    response.send('Incorrect Username and/or Password! <br>  <p><a href="/">Login</a> <a href="/create">Create an Account</a></p>');
                }
                // response.end();
            });

        } else {
            response.send('Please enter Username and Password!');
            response.end();
        }
    }
    makeConnection()
    logUserIn()
});

// http://localhost:3000/logout
app.get('/logout', function(request, response) {

    if (request.session.loggedin) {

        request.session.destroy((err) => {
            response.redirect('/') // will always fire after session is destroyed

          })
    }
})



// http://localhost:3000/oldhome
app.get('/oldhome', function(request, response) {
    // If the user is loggedin
    if (request.session.loggedin) {
        console.log('successful login by', request.session.username)
            
        response.render('pages/home.ejs')
    } else {
        // Not logged in
        response.send('Please login to view this page!');
    }
    response.end();
});

// http://localhost:3000/create
app.get('/create', function(request, response) {
    // Render create template
    response.sendFile(path.join(__dirname + '/createAccount.html'));
});

// http://localhost:3000/createAuth
//authorizes that the account is not already taken, and adds to db if so
app.post('/createAuth', function(request, response) {
    //store form inputs into variables
    let username = request.body.username;
    let email = request.body.password;
    let password = request.body.password;

    if (username && password && email) {

        connection.query('INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)', [username, email, password], function(error) {

            // If there is an issue with the query, output the error, else redirect to login and say success
            if (error) {

                throw error
            } else {
                response.send('Successfully created new account!!!!')
                    // setTimeout(response.redirect('/'), 3000)
            }
        })
        connection.end(err => {
            if(err){
                console.log(`${err.toString()}`)
            }
            })

        // Execute SQL query that'll select accounts with given username or email
        // connection.query('SELECT * FROM accounts WHERE username = ? OR email = ?', [username, email], function(error, results, fields) {
        //     // If there is an issue with the query, output the error
        //     if (error) throw error;

        //     // If the account does not exist
        //     if (results.length = 0) {
        //         // Add user to DB
        //         connection.query('INSERT INTO account (username, email, password) VALUES ?', [username, email, password], function(error) {

        //         // If there is an issue with the query, output the error, else redirect to login and say success
        //         if (error) {

        //             throw error
        //         } else {
        //             response.send('Successfully created new account!!!!')
        //             setTimeout(response.redirect('/'), 3000)
        //         }
        //         })

        //     } else {
        //         console.log(results.length)
        //         response.send('Username or email already taken! <br>  <p><a href="/">Login</a> <a href="/create">Create an Account</a></p>');
        //         // response.end();
        //     }
        //     response.end();
        // });
    } else {
        response.send('Please enter all required fields!');
        response.end();
    }
});
let server = app.listen(3000);
server.keepAliveTimeout = 61 * 1000;