/*
    SETUP code is from the CS 340 starter code
*/
// Express
var express = require('express');
var app     = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));
console.log(__dirname + '/public')
PORT        = 1245;
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"})); 
app.set('view engine', '.hbs');

// Database
var db = require('./database/db-connector')

/*
    ROUTES For calls to render() and usages of db.pool.query(), as well as error handling we referred to the CS 340 starter code
*/
app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.  we referred to CS 340 starter code

function changeDateFormat(obj_list) {
    for (const obj of obj_list) {
        obj.startDate = obj.startDate.toISOString().slice(0,10)
        if (typeof obj.endDate !== 'string') {
            obj.endDate = obj.endDate.toISOString().slice(0,10)
        }
    }
}

app.get('/loans', function(req, res)
{  
    let query1 = `SELECT Loans.loanID, Loans.patronID, Patrons.lastName, Patrons.firstName, Loans.bookID, Books.title, Loans.startDate, Loans.endDate
    FROM Loans
    INNER JOIN Patrons ON Loans.patronID = Patrons.patronID
    INNER JOIN Books ON Loans.bookID = Books.bookID;`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, (error, rows, fields) => {    // Execute the query we referred to CS 340 starter code
        changeDateFormat(rows)
        res.render('loans', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows'  we referred to CS 340 starter code
}); 

app.post('/add-loan', (req, res) =>{
    // data processing
    let data = req.body;
    console.log(data)
    // Capture NULL values we referred to CS 340 starter code
    let patronID = (parseInt(data.patronID));
    if (isNaN(patronID)) {
        patronID = 'NULL'
    }

    let bookID = parseInt(data.bookID);
    if (isNaN(bookID)) {
        bookID = 'NULL'
    }
    // Create the query and run it on the database we referred to CS 340 starter code
    const query1 = `INSERT INTO Loans (patronID, bookID, startDate, endDate) VALUES
    (${data.patronID}, ${data.bookID}, '${data.startDate}', '${data.endDate}');`;
    db.pool.query(query1, (error, rows, fields) => {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request. we referred to CS 340 starter code
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/loans');
        }
    })
});

app.post('/delete-loan', (req, res) => {
    // data processing
    let data = req.body;
    console.log(data)
    let loanID = parseInt(data.loanID);
    let deleteLoan= `DELETE FROM Loans WHERE loanID = ?;`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(deleteLoan, [loanID], (error, rows, fields) => {
        if (error) {
        console.log(error);
        res.sendStatus(400);
        } else {
            res.redirect('/loans')
        }
    })
});

app.post('/update-loan', (req, res) => {
    // data processing
    let data = req.body;
    let loanID = data.loanID !== ''? parseInt(data.loanID) : undefined;
    let patronID = data.patronID !== ''? data.patronID : undefined;
    let bookID = data.bookID !== ''? data.bookID : undefined;
    let startDate = data.startDate !== ''? data.startDate : undefined;
    let endDate = data.endDate !== ''? data.endDate : undefined;
    console.log(data)
    let updateLoan= `UPDATE Loans SET Loans.patronID = COALESCE(?, Loans.patronID), Loans.bookID = COALESCE(?, Loans.bookID), 
    Loans.startDate = COALESCE(?, Loans.startDate), Loans.endDate = COALESCE(?, Loans.endDate)
    WHERE loanID = ?;`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(updateLoan, [patronID, bookID, startDate, endDate, loanID], (error, rows, fields) => {
        if (error) {
        console.log(error);
        res.sendStatus(400);
        } else {
            res.redirect('/loans')
        }
    })
});

app.get('/view-loans', (req, res) => {
    let data = req.query;
    console.log(data)
    // data processing
    let loanID = data.loanID !== ''? data.loanID : undefined;
    let patronID = data.patronID !== ''? data.patronID : undefined;
    let lastName = data.lastName !== ''? data.lastName : undefined;
    let firstName = data.firstName !== ''? data.firstName : undefined;
    let bookID = data.bookID !== ''? data.bookID : undefined;
    let title = data.title !== ''? data.title : undefined;
    let startDate = data.startDate !== ''? data.startDate : undefined;
    let endDate = data.endDate !== ''? data.endDate : undefined;
    // Create the query and run it on the database we referred to CS 340 starter code
    let query1 = `SELECT Loans.loanID, Loans.patronID, Patrons.lastName, Patrons.firstName, Loans.bookID, Books.title, Loans.startDate, Loans.endDate
    FROM Loans
    INNER JOIN Patrons ON Loans.patronID = Patrons.patronID
    INNER JOIN Books ON Loans.bookID = Books.bookID
    WHERE Loans.loanID =  COALESCE(?, Loans.loanID)
    AND Loans.patronID = COALESCE(?, Loans.patronID) AND Patrons.lastName = COALESCE(?, Patrons.lastName) AND Patrons.firstName = COALESCE(?, Patrons.firstName) 
    AND Loans.bookID = COALESCE(?, Loans.bookID) AND Books.title = COALESCE(?, Books.title)
    AND Loans.startDate = COALESCE(?, Loans.startDate) AND Loans.endDate = COALESCE(?, Loans.endDate);`;
    db.pool.query(query1, [loanID, patronID, lastName, firstName, bookID, title, startDate, endDate] , (error, rows, fields) => {    // Execute the query we referred to CS 340 starter code
        changeDateFormat(rows)
        res.render('loans', {data: rows});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
    })
})

// ---------------------------------------------
// Genres
// ---------------------------------------------
app.get('/genres', function(req, res)
{  
    let query1 = `SELECT genreID, genreName
    FROM Genres;`;
    let query2 = `SELECT genreName 
    FROM Genres;`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, function(error, rows, fields) {    // Execute the query we referred to CS 340 starter code
        let genres = rows;
        db.pool.query(query2, (error, rows, fields) => {
            // Save genreNames
            let genreNames = rows;
            return res.render('genres', {data: genres, genreNames: genreNames});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
        })                                                      // an object where 'data' is equal to the 'rows'  we referred to CS 340 starter code
    }); 
})

// app.js
app.post('/add-genre', (req, res) => {
    let data = req.body;
    console.log(data);
    // Capture NULL values
    let genreName = data.genreName !== ''? data.genreName : null;

    // Create the query and run it on the database we referred to CS 340 starter code
    const query1 = `INSERT INTO Genres (genreName) VALUES (?)`;
    db.pool.query(query1, [genreName], (error, rows, fields) => {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/genres');
        }
    });
});

app.get('/view-genres', (req, res) => {
    let data = req.query;
    console.log(data)
    let genreName = data.genreName !== ''? data.genreName: undefined;
    // Create the query and run it on the database we referred to CS 340 starter code
    let query1 = `SELECT genreID, genreName
    FROM Genres
    WHERE Genres.genreName =  ?;`;
    db.pool.query(query1, [genreName], (error, rows, fields) => {    // Execute the query  we referred to CS 340 starter code
        res.render('genres', {data: rows});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
    })
})

// ---------------------------------------------
// Books-Genres
// ---------------------------------------------
app.get('/books-genres', function(req, res)
{  
    let query1 = `SELECT Books_Genres.bookGenreID, Books_Genres.bookID, Books.title, Books_Genres.genreID, Genres.genreName
    FROM Books_Genres
    INNER JOIN Books ON Books_Genres.bookID = Books.bookID
    INNER JOIN Genres ON Books_Genres.genreID = Genres.genreID;`; 
    let query2 = `SELECT *
    FROM Books`;
    let query3 = `SELECT *
    FROM Genres`;
    let query4 = `SELECT bookGenreID FROM Books_Genres;`;
    // Dynamic drop-downs
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, function(error, rows, fields) {
        let data = rows; 
        db.pool.query(query2, function(error, rows, fields) {
            let books = rows;
            db.pool.query(query3, function(error, rows, fields) {    // Execute the query we referred to CS 340 starter code
                let genres = rows;
                db.pool.query(query4, function(error, rows, fields) {
                    let bookGenres = rows;
                            console.log()
                            res.render('books-genres', {data: data, books: books, genres: genres, bookGenres: bookGenres});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
                        })
                    })
                })
    })                                                      // an object where 'data' is equal to the 'rows'  we referred to CS 340 starter code
}); 

app.post('/add-books-genres', (req, res) =>{
    let data = req.body;
    console.log(data)

    let bookID = parseInt(data.bookID);
    let genreID = parseInt(data.genreID);

    // Dynamic drop-downs
    // Create the query and run it on the database we referred to CS 340 starter code
    const query1 = `INSERT INTO Books_Genres (bookID, genreID) VALUES (?, ?);`;
    db.pool.query(query1, [bookID, genreID], (error, rows, fields) => {
        // Check to see if there was an error we referred to CS 340 starter code
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request. we referred to CS 340 starter code
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/books-genres');
        }
    })
});

app.get('/view-books-genres', (req, res) => {
    let data = req.query;
    console.log(data)
    let title = data.title !== ''? data.title: undefined;
    let genreName = data.genreName !== ''? data.genreName: undefined;
    
    let query1 = `SELECT Books_Genres.bookGenreID, Books_Genres.bookID, Books.title, Books_Genres.genreID, Genres.genreName
    FROM Books_Genres
    INNER JOIN Books ON Books_Genres.bookID = Books.bookID
    INNER JOIN Genres ON Books_Genres.genreID = Genres.genreID
    WHERE Books.title = COALESCE(?, Books.title)
    AND Genres.genreName = COALESCE(?, Genres.genreName);`;
    // Dynamic drop-downs
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, [title, genreName], (error, rows, fields) => {    // Execute the query we referred to CS 340 starter code
        // console.log(inputList)
        res.render('books-genres', {data: rows});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
    })
})

app.post('/update-books-genres', (req, res) => {
    let data = req.body;
    let bookGenreID = data.bookGenreID !== ''? parseInt(data.bookGenreID) : undefined;
    let bookID = data.bookID !== ''? parseInt(data.bookID) : undefined;
    let genreID = data.genreID !== ''? parseInt(data.genreID) : undefined;
    console.log(genreID)
    let updateBooks_Genres = `UPDATE Books_Genres SET bookID = ?, genreID = ? 
    WHERE bookGenreID = ?;`;
    // Dynamic drop-downs
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(updateBooks_Genres, [bookID, genreID, bookGenreID], (error, rows, fields) => {
        if (error) {
        console.log(error);
        res.sendStatus(400);
        } else {
            res.redirect('/books-genres')
        }
    })
});



// ---------------------------------------------
// Books
// ---------------------------------------------
app.get('/books', function(req, res)
{  
    let query1 = `SELECT Books.bookID, Books.title, Books.author, Locations.locationName
    FROM Books
    LEFT JOIN Locations ON Books.locationID = Locations.locationID;`;
    let query2 = `SELECT * FROM Locations;`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, function(error, rows, fields) {    // Execute the query  we referred to CS 340 starter code
        let books = rows;
        for (let entry of books) {
            if (typeof entry.locationName !== 'string') {
                entry.locationName = 'NULL'
            }
        }
        db.pool.query(query2, (error, rows, fields) => {
            // Save Location IDs
            let locations = rows;
            return res.render('books', {books: books, locations: locations});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
        })                                                      // an object where 'data' is equal to the 'rows'  we referred to CS 340 starter code
    }); 
})

app.post('/add-books', (req, res) =>{
    let data = req.body;
    console.log(data)
    // Capture NULL values
    let title = data.title;
    let author = data.author;
    let locationID = data.locationID !== ''? data.locationID: undefined;
    const query1 = `INSERT INTO Books (title, author, locationID) 
    VALUES (?, ?, ?);`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, [title, author, locationID], (error, rows, fields) => {
        // Check to see if there was an error we referred to CS 340 starter code
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request. we referred to CS 340 starter code
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/books');
        }
    })
});

app.get('/view-books', (req, res) => {
    let data = req.query;
    console.log(data)
    let bookID = data.bookID !== ''? data.bookID: undefined;
    let title = data.title !== ''? data.title: undefined;
    let author = data.author !== ''? data.author: undefined;
    let locationName = data.locationName !== ''? data.locationName: undefined;

    let query1 = `SELECT Books.bookID, Books.title, Books.author, Locations.locationName
    FROM Books
    LEFT JOIN Locations ON Books.locationID = Locations.locationID
    WHERE bookID =  COALESCE(?, bookID)
    AND title =  COALESCE(?, title) 
    AND author =  COALESCE(?, author) 
    AND locationName = COALESCE(?, locationName);`;

    if (data.nullLocation === 'on') {
        query1 = `SELECT *
        FROM Books
        WHERE locationID IS NULL;`;
    // Create the query and run it on the database we referred to CS 340 starter code
        db.pool.query(query1, (error, rows, fields) => {    // Execute the query we referred to CS 340 starter code
            console.log(rows)
            let books = rows;
            for (let entry of books) {
                if (typeof entry.locationName !== 'string') {
                    entry.locationName = 'NULL'
                }
            }
            res.render('books', {books: books});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
        })
    } else {
        db.pool.query(query1, [bookID, title, author, locationName], (error, rows, fields) => {    // Execute the query we referred to CS 340 starter code
            console.log(rows)
            res.render('books', {books: rows});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
        })
    }

})

app.post('/update-books', (req, res) => {
    let data = req.body;
    let bookID = data.bookID !== ''? parseInt(data.bookID) : undefined;
    let locationID = data.locationID !== ''? parseInt(data.locationID) : undefined;
    console.log(data)
    let updateBooks = `UPDATE Books SET locationID = ?
    WHERE bookID = ?;`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(updateBooks, [locationID, bookID], (error, rows, fields) => {
        if (error) {
        console.log(error);
        res.sendStatus(400);
        } else {
            res.redirect('/books')
        }
    })
});

// ---------------------------------------------
// Locations
// ---------------------------------------------
app.get('/locations', function(req, res)
{  
    let query1 = `SELECT locationID, locationName
    FROM Locations;`;
    let query2 = `SELECT locationName 
    FROM Locations;`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, function(error, rows, fields) {    // Execute the query we referred to CS 340 starter code
        let locations = rows;
        db.pool.query(query2, (error, rows, fields) => {
            // Save genreNames
            let locationNames = rows;
            return res.render('locations', {data: locations, locationNames: locationNames});                  // Render the index.hbs file, and also send the renderer we referred to CS 340 starter code
        })                                                      // an object where 'data' is equal to the 'rows' we referred to CS 340 starter code
    });
});

app.post('/add-location', (req, res) => {
    let data = req.body;
    console.log(data);
    // Capture NULL values
    let locationName = data.locationName ? data.locationName : null;
    // Create the query and run it on the database we referred to CS 340 starter code
    const query1 = `INSERT INTO Locations (locationName) VALUES (?)`;
    db.pool.query(query1, [locationName], (error, rows, fields) => {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/locations');
        }
    });
});

app.get('/view-locations', (req, res) => {
    let data = req.query;
    console.log(data)
    let locationName = data.locationName !== ''? data.locationName: undefined;
    let query1 = `SELECT locationID, locationName
    FROM Locations
    WHERE Locations.locationName =  ?;`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, [locationName], (error, rows, fields) => {    // Execute the query
        // console.log(inputList)
        console.log(rows)
        res.render('locations', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })
})


// ---------------------------------------------
// Patrons
// ---------------------------------------------
app.get('/patrons', function(req, res)
{  
    let query1 = `SELECT * FROM Patrons;`;
        // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, (error, rows, fields) => {    // Execute the query
        res.render('patrons', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
}); 

app.get('/view-patrons', (req, res) => {
    let data = req.query;
    console.log(data)
    let patronID = data.patronID !== ''? data.patronID: undefined;
    let lastName = data.lastName !== ''? data.lastName: undefined;
    let firstName = data.firstName !== ''? data.firstName: undefined;
    let  email = data.email !== ''? data.email: undefined;
    let phone = data.phone !== ''? data.phone: undefined;
    let fines = data.fines !== ''? data.fines: undefined;
    
    let query1 = `SELECT *
    FROM Patrons
    WHERE patronID =  COALESCE(?, patronID)
    AND lastName =  COALESCE(?, lastName) 
    AND firstName =  COALESCE(?, firstName) 
    AND email = COALESCE(?, email)
    AND phone = COALESCE(?, phone)
    AND fines = COALESCE(?, fines);`;
    // Create the query and run it on the database we referred to CS 340 starter code
    db.pool.query(query1, [patronID, lastName, firstName, email, phone, fines], (error, rows, fields) => {    // Execute the query
        // console.log(inputList)
        res.render('patrons', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })
})

app.post('/update-patron', (req, res) => {
    let data = req.body;
    console.log(data)
    let patronID = data.patronID !== ''? data.patronID: undefined;
    let lastName = data.lastName !== ''? data.lastName: undefined;
    let firstName = data.firstName !== ''? data.firstName: undefined;
    let  email = data.email !== ''? data.email: undefined;
    let phone = data.phone !== ''? data.phone: undefined;
    let fines = data.fines !== ''? data.fines: undefined;
    // Create the query and run it on the database we referred to CS 340 starter code
    let query1 = `UPDATE Patrons 
    SET lastName =  COALESCE(?, lastName), firstName =  COALESCE(?, firstName), email = COALESCE(?, email), phone = COALESCE(?, phone), fines = COALESCE(?, fines)
    WHERE patronID = ?;`;
    //
    db.pool.query(query1, [lastName, firstName, email, phone, fines, patronID], (error, rows, fields) => {
        if (error) {
        console.log(error);
        res.sendStatus(400);
        } else {
            res.redirect('/patrons')
        }
    })
});

app.post('/add-patron', (req, res) =>{
    let data = req.body;
    console.log(data)
    // Create the query and run it on the database we referred to CS 340 starter code
    const query1 = `INSERT INTO Patrons (lastName, firstName, email, phone, fines) VALUES
    ('${data.lastName}', '${data.firstName}', '${data.email}', '${data.phone}', '${data.fines}');`;
    db.pool.query(query1, (error, rows, fields) => {
        // Check to see if there was an error we referred to CS 340 starter code
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request. we referred to CS 340 starter code
            console.log(error)
            res.sendStatus(400);
        } else {
            res.redirect('/patrons');
        }
    })
});

app.post('/delete-patron', (req, res) => {
    let data = req.body;
    console.log(data)
    let patronID = parseInt(data.patronID);
    let query1= `DELETE FROM Patrons WHERE patronID = ?;`;
    db.pool.query(query1, [patronID], (error, rows, fields) => {
        if (error) {
        console.log(error); // we referred to CS 340 starter code
        res.sendStatus(400);
        } else {
            res.redirect('/patrons') //we referred to CS 340 starter code
        }
    })
});




/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

