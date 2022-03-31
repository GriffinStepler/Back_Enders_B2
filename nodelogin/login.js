const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

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

// http://localhost:3000/
app.get('/', function(request, response) {
    // Render login template
    response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                request.session.loggedin = true;
                request.session.username = username;
                request.session.password = password;
                //request.session.email = email;
                // Redirect to home page
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password! <br>  <p><a href="/">Login</a> <a href="/create">Create an Account</a></p>');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
    // If the user is loggedin
    if (request.session.loggedin) {
        console.log('successful login by', request.session.username)
        // Output username
        response.send('Welcome back, ' + request.session.username + '!' + request.session.password);
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

    var acctInfo = [username, email, password]
    
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
app.listen(3000);