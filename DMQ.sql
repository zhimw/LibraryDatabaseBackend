----------------------------------------------------------------
-- Books table -------------------------------------------------
----------------------------------------------------------------
-- Display selected books (location is not null)
SELECT Books.bookID, Books.title, Books.author, Locations.locationName
FROM Books
LEFT JOIN Locations ON Books.locationID = Locations.locationID
WHERE Books.bookID = :bookID
AND Books.title = :title
AND Books.author = :author
AND Locations.locationName = :locationName;

-- Display all books with NULL locations
SELECT * FROM Books WHERE locationID IS NULL; 

-- Insert a new book
INSERT INTO Books (title, author, locationID) VALUES
(:title, :author, (SELECT locationID FROM Locations WHERE locationName = :locationName));

-- Display all books
SELECT Books.bookID, Books.title, Books.author, Locations.locationName
FROM Books
LEFT JOIN Locations ON Books.locationID = Locations.locationID;

-- Update book location
UPDATE Books SET locationID = (SELECT locationID FROM Locations WHERE locationName = :locationName)
WHERE bookID = :bookID;


-----------------------------------------------------------------
-- Genres table -------------------------------------------------
-----------------------------------------------------------------
-- Display all genres
SELECT genreID, genreName
FROM Genres;

-- Display select generes
SELECT genreID, genreName
FROM Genres
WHERE genreName = :genreName;

-- Insert a new genre
INSERT INTO Genres (genreName) VALUES
(:genreName);


-------------------------------------------------------------------
-- Books_Genres table ----------------------------------------------
-------------------------------------------------------------------
-- Display all books in a given genre
SELECT Books_Genres.bookGenreID, Books_Genres.bookID, Books.title, Books_Genres.genreID, Genres.genreName
FROM Books_Genres
INNER JOIN Books ON Books_Genres.bookID = Books.bookID
INNER JOIN Genres ON Books_Genres.genreID = Genres.genreID;

-- Display select books-genres relationships
SELECT Books.title, Genres.genreName
FROM Books
INNER JOIN Books_Genres ON Books.bookID = Books_Genres.bookID
INNER JOIN Genres ON Books_Genres.genreID = Genres.genreID
WHERE Books.title = :book_name AND Genres.genreName = :genre_name;

-- Update a book_genre relationship
UPDATE Books_Genres SET bookID = (SELECT bookID FROM Books WHERE title = :title), genreID = (SELECT genreID FROM Genres WHERE genreName = :genreName)
WHERE bookGenreID = :bookGenreID;

-- Insert new book_genre relationship (M:N relationship)
INSERT INTO Books_Genres (bookID, genreID) VALUES
((SELECT bookID FROM Books WHERE bookID = :bookID), (SELECT genreID FROM Genres WHERE genreName = :genreName));



------------------------------------------------------------------
-- Locations table -----------------------------------------------
------------------------------------------------------------------
-- Display all location information
SELECT locationID, locationName
FROM Locations;

-- Display select location information
SELECT locationID, locationName
FROM Locations
WHERE locationName = :locationName;

-- Insert new location
INSERT INTO Locations (locationName) VALUES
(:locationName);


------------------------------------------------------------------
-- Patrons table -------------------------------------------------
------------------------------------------------------------------
-- Display all patrons
SELECT patronID, lastName, firstName, email, phone, fines
FROM Patrons;

-- Display select patrons
SELECT patronID, lastName, firstName, email, phone, fines
FROM Patrons
WHERE patronID = :patronID
AND lastName = :lastName
AND firstName = :firstName
AND email = :email
AND phone = :phone
AND fines = :fines;

-- Update patron
UPDATE Patrons SET lastName = :lastName, firstName = :firstName, email = :email, phone = :phone, fines = :fines
WHERE patronID = :patronID;

-- Insert new patron
INSERT INTO Patrons (lastName, firstName, email, phone, fines) VALUES
(:lastName, :firstName, :email, :phone, :fines);

-- Remove a patron
DELETE FROM Patrons 
WHERE patronID = :patronID;


------------------------------------------------------------------
-- Loans table ---------------------------------------------------
------------------------------------------------------------------
-- Display all loans
SELECT Loans.loanID, Loans.patronID, Patrons.lastName, Patrons.firstName, Loans.bookID, Books.title, Loans.startDate, Loans.endDate
FROM Loans
INNER JOIN Patrons ON Loans.patronID = Patrons.patronID
INNER JOIN Books ON Loans.bookID = Books.bookID;

-- Display select loans
SELECT Loans.loanID, Loans.patronID, Patrons.lastName, Patrons.firstName, Loans.bookID, Books.title, Loans.startDate, Loans.endDate
FROM Loans
INNER JOIN Patrons ON Loans.patronID = Patrons.patronID
INNER JOIN Books ON Loans.bookID = Books.bookID
WHERE loanID = :loanID
AND Loans.patronID = :patronID
AND Patrons.lastName = :lastName
AND Patrons.firstName = :firstName
AND Loans.bookID = :bookID
AND Books.title = :title
AND Loans.startDate = :startDate
AND Loans.endDate = :endDate;

-- Update the endDate of a loan
UPDATE Loans SET endDate = :endDate
WHERE loanID = :loanID;

-- Insert new loan (M:N relationship)
INSERT INTO Loans (patronID, bookID, startDate, endDate) VALUES
(:patronID, :bookID, :startDate, :endDate);

-- Remove a loan
DELETE FROM Loans WHERE loanID = :loanID;
