const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password should be provided" });
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  // Update the users array in auth_users.js
  return res.status(300).json({ message: "Customer successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let filteredBooks = books[isbn];
  if (!filteredBooks) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(filteredBooks);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filteredBooks = Object.values(books).filter(
    (book) => book.author === author
  );
  if (!filteredBooks) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let filteredBooks = Object.values(books).filter(
    (book) => book.title === title
  );
  if (!filteredBooks) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let filteredBooks = books[isbn];
  if (!filteredBooks) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(filteredBooks.reviews);
});

module.exports.general = public_users;
