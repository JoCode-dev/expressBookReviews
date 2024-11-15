const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const e = require("express");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let validUsername = users.filter((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter(
    (user) => user.username === username && user.password === password
  );

  return validUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password should be provided" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  if (!review) {
    return res.status(400).json({ message: "Review should be provided" });
  }

  // Check if the book exists
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add the review
  book.reviews[req.user.username] = review;

  return res
    .status(200)
    .json({
      message: `The review for book with ISBN ${isbn} is added/updated`,
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  // Check if the book exists
  let book = books[isbn];

  console.log(book);
  

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists
  if (!book.reviews[req.user.username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review
  delete book.reviews[req.user.username];

  return res
    .status(200)
    .json({
      message: `The review for book with ISBN ${isbn} is deleted`,
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
