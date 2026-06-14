const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      // If user is not already registered, push them to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user. Please provide username and password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return the entire books object nicely formatted
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  
  // Iterate through the books object to find matches
  for (const isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push({"isbn": isbn, ...books[isbn]});
    }
  }
  
  if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
  } else {
      return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  
  // Iterate through the books object to find matches
  for (const isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push({"isbn": isbn, ...books[isbn]});
    }
  }
  
  if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
  } else {
      return res.status(404).json({message: "No books found with this title"});
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
      // Return only the reviews for the specified book
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;