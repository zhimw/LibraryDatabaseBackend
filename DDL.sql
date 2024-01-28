
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- --------------------------
-- Library Database --
-- --------------------------

-- Books table --
DROP TABLE IF EXISTS Books;
CREATE TABLE Books (
    bookID int(11) NOT NULL AUTO_INCREMENT,
	title varchar(255) NOT NULL,
	author varchar(255) NOT NULL,
	locationID int(11),
	PRIMARY KEY (bookID),
    FOREIGN KEY (locationID) REFERENCES Locations(locationID)
)ENGINE=INNODB;

-- Patrons table--
DROP TABLE IF EXISTS Patrons;
CREATE TABLE Patrons (
    patronID int(11) NOT NULL AUTO_INCREMENT,
	lastName varchar(255) NOT NULL,
    firstName varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	phone varchar(20) NOT NULL,
    fines decimal(6,2),
	PRIMARY KEY (patronID),
    UNIQUE KEY (email),
    UNIQUE KEY (phone)
)ENGINE=INNODB;

-- Loans table --
DROP TABLE IF EXISTS Loans;
CREATE TABLE Loans (
    loanID int(11) NOT NULL AUTO_INCREMENT,
	patronID int(11) NOT NULL,
    bookID int(11) NOT NULL,
    startDate date NOT NULL,
    endDate date NOT NULL,
	PRIMARY KEY (loanID),
 	FOREIGN KEY (patronID) REFERENCES Patrons(patronID)ON DELETE CASCADE,
    FOREIGN KEY (bookID) REFERENCES Books(bookID)ON DELETE CASCADE
)ENGINE=INNODB;

-- Genres table --
DROP TABLE IF EXISTS Genres;
CREATE TABLE Genres (
    genreID int(11) NOT NULL AUTO_INCREMENT,
	genreName varchar(255) NOT NULL,
	PRIMARY KEY (genreID),
	UNIQUE KEY (genreName)
)ENGINE=INNODB;

-- LOCATIONS table --
DROP TABLE IF EXISTS Locations;
CREATE TABLE Locations (
    locationID int(11) NOT NULL AUTO_INCREMENT,
	locationName varchar(255) NOT NULL,
	PRIMARY KEY (locationID)
)ENGINE=INNODB;

-- Books_Genres table --
-- intersection table between Books and Genres --
DROP TABLE IF EXISTS `Books_Genres`;
CREATE TABLE `Books_Genres` (
  `bookGenreID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `bookID` int(11) NOT NULL,
  `genreID` int(11) NOT NULL,
  FOREIGN KEY (`bookID`) REFERENCES `Books` (`bookID`) ON DELETE CASCADE,
  FOREIGN KEY (`genreID`) REFERENCES `Genres` (`genreID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- ---------------------
-- Example Data --------
-- ---------------------
INSERT INTO Genres (genreName) VALUES
('Fantasy'),
('Sci-Fi'),
('Mystery'),
('Horror'),
('Romance');

INSERT INTO Locations (locationName) VALUES
('Checked Out'),
('Hold Shelf'),
('Shelf A'),
('Shelf B'),
('Shelf C');

INSERT INTO Patrons (lastName, firstName, email, phone, fines) VALUES
('Thompson', 'Timmy', 'timmy@gmail.com', '3025551243', 0.24),
('Guetierrez', 'Maria', 'marrez@yahoo.com', '4395559241', 0),
('Nevas', 'Bob', 'billybob@yahoo.com', '4065556882', 0),
('Potter', 'Tina', 'girlwholived@gmail.com', '6565559020', 21.50),
('Silva', 'Mario', 'itsmeamario@yahoo.com', '9735552031', 2),
('Roberts', 'Laura', 'lroberts12@gmail.com', '8405550024', 0.50);

INSERT INTO Books (title, author, locationID) VALUES
('The Hobbit', 'J.R.R. Tolkien', 1),
('Jurrasic Park', 'Michael Crichton', NULL),
('IT', 'Stephen King', 4),
('People We Meet on Vacation', 'Emily Henry', 1),
('Pay Dirt Road', 'Samantha Jayne Allen', 3),
('The Eye of the World', 'Robert Jordan', 1);

INSERT INTO Loans (patronID, bookID, startDate, endDate) VALUES
(3, 2, '2023-07-10', '2023-07-31'),
(5, 5, '2023-07-01', '2023-07-21'),
(1, 6, '2023-07-10', '2023-07-20'),
(4, 3, '2023-07-17', '2023-08-02'),
(2, 1, '2023-07-20', '2023-08-10'),
(6, 4, '2023-07-14', '2023-07-31');

INSERT INTO Books_Genres (bookID, genreID) VALUES
(1, 1),
(2, 2),
(2, 4),
(2, 3),
(3, 4),
(4, 5),
(5, 1);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
