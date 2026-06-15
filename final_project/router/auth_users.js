const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const { date } = require("intlayer");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const userExists = users.some((user) => user.username === username);
  return !userExists;
};

const authenticatedUser = (username, password) => {
  console.log("--- Debugging Authentication Match ---");
  console.log(
    `Checking for input: username="${username}", password="${password}"`,
  );

  let validateUser = users.filter((user) => {
    // Log each user in the array to see exactly what keys and values exist
    console.log(`Comparing against record: `, user);
    console.log(`Username match? ${user.username === username}`);
    console.log(`Password match? ${user.password === password}`);

    return user.username === username && user.password === password;
  });

  return validateUser.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let name = req.body.username;
  let password = req.body.password;
  console.log("Current users in memory during login attempt:", users);
  if (!name || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(name, password)) {
    let accessToken = jwt.sign(
      {
        username: name,
      },
      "access",
      { expiresIn: 60 * 60 },
    );

    req.session.authorization = { accessToken, username: name };
    return res.status(200).send("user successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  books[isbn].review = review;
  return res
    .status(200)
    .json({ message: "review updated", newReview: review, Book: books[isbn] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let bookId = req.params.isbn;
  let foundBook = books[bookId];
  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }
  delete foundBook.reviews;

  return res.status(200).json({
    message: "success book review deleted ",
    foundBook: foundBook,
  });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
