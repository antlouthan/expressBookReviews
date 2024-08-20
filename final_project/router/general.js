const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

function getBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books not found");
        }
    });
}


public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username) {
      res.status(400).send("No username provided!");
    } else if (!password) {
      res.status(400).send("No password provided!");
    } else if (users.find(user => user.username === username)) {
      res.status(400).send("User already registered!");
    } else {
      users.push({
        "username": username,
        "password": password
      });
      res.status(200).send("User registered successfully!");
      console.log(users);
    }
  });
  
//ORIGINAL TASK 1
// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     res.send(JSON.stringify(books, null, 4));
// });

//Updated Task 1:
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const booksData = await getBooks(); // Await the promise resolution
        res.send(JSON.stringify(booksData, null, 4));
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching books", error: error });
    }
});

//ORIGINAL TASK 2
// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = req.params.isbn;

//     res.send(books[isbn]);
//  });

//UPDATED TASK 11
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const booksData = await getBooks(); // Await the promise resolution
        const book = booksData[isbn];

        if (book) {
            res.send(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching book details", error: error });
    }
});

  //ORIGINAL TASK 3
// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//     let filtered_books = Object.values(books).filter((book) => book.author === author);
//     if(filtered_books)
//     {
//         res.send(filtered_books);
//     }
//     else
//     {
//         res.status(404).json({ message: "No books found for the author" });
//     }
    
// });

//UPDATED TASK 12
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const booksData = await getBooks(); // Await the promise resolution
        let filtered_books = Object.values(booksData).filter((book) => book.author === author);

        if (filtered_books.length > 0) {
            res.send(filtered_books);
        } else {
            res.status(404).json({ message: "No books found for the author" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching books by author", error: error });
    }
});

//ORIGINAL TASK 4
// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title;
//     let filtered_books = Object.values(books).filter((book) => book.title === title);
//     if(filtered_books)
//     {
//         res.send(filtered_books);
//     }
//     else
//     {
//         res.status(404).json({ message: "No books found for the title provided" });
//     }
    
// });

//UPDATED TASK 13
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const booksData = await getBooks(); // Await the promise resolution
        let filtered_books = Object.values(booksData).filter((book) => book.title === title);

        if (filtered_books.length > 0) {
            res.send(filtered_books);
        } else {
            res.status(404).json({ message: "No books found for the title" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching books by title", error: error });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
