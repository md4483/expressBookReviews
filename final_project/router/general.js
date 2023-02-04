const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        if (!doesExist(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

const getAllBooks = async () => {
	try {
		const allBooksPromise = await Promise.resolve(books)
		if (allBooksPromise) {
			return allBooksPromise
		} else {
			return Promise.reject(new Error('No books found.'))
		}
	} catch (err) {
		console.log(err)
	}
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));;
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let out = []
    for(const [key, value] of Object.entries(books)){
        if(value['author'] == req.params.author){
            out.push(value);
        }
    }
    if(out.length == 0){
      return res.status(300).json({message: "Author not found"});
    }
    res.send(out);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let out = []
    for(const [key, value] of Object.entries(books)){
        if(value['title'] == req.params.title){
            out.push(value);
        }
    }
    if(out.length == 0){
      return res.status(300).json({message: "Title not found"});
    }
    res.send(out);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn]['reviews'], null, 4));;
});

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

function getByAuthor(author) {
    return new Promise((resolve, reject) => {
        if (books[author]) {
            resolve(books[author]);
        }
    })
}

module.exports.general = public_users;
