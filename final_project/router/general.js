const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  let name=req.body.username
  let password=req.body.password
  let doseExist= users.find((user)=>user.name==name);
  if(name && password) {
    if(!doseExist){
      users.push({"username":name,"password":password})
      return res.status(200).json({message:'user registered'})
    }else {
      return res.status(300).json({message:"user already exist"})
    }
  }
   return res.status(404).json({ message: "Unable to register user." });
});   

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json({ message: "success", books: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let bookId = req.params.isbn;
  let foundBook = books[bookId];
  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json({ message: "success", book: foundBook });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;
  let foundBook;
  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      if (author == books[key].author.split(" ")[0]) {
        foundBook = books[key];
        return res.status(200).json({ message: "success", book: foundBook });
      }
    }
  }
  return res.status(404).json({ message: "Not found" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let foundBook;
  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      // let formattedAuthor=books[key].author
      // let splitAuthor=formattedAuthor.split(" ")(0)
      if (title == books[key].title.split(" ")[0]) {
        foundBook = books[key];
        return res.status(200).json({ message: "success", book: foundBook });
      }
    }
  }
  return res.status(404).json({ message: "Not found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let bookId = req.params.isbn;
  let foundBook = books[bookId];
  if (!foundBook) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res
    .status(200)
    .json({ message: "success",foundBook:foundBook, bookReviewOnly: foundBook.reviews });
});



module.exports.general = public_users;
