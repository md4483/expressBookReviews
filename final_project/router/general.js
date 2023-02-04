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
		return err
	}
}

function getByISBN(isbn){
    return new Promise((resolve,reject)=>{
        if (books[isbn]) {
            resolve(books[isbn]);
        }
        else {
            reject("Book not found");
        }
    })
}

function getByAuthor(author){
    let out = []
    return new Promise((resolve,reject)=>{
        for (var isbn in books) {
            if (books[isbn]['author'] == author) {
                out.push(books[isbn])
            }
        }
        if (out.length > 0) {
            resolve(out);
        }
        else {
            reject("No books found by "+author);
        }
    })
}

function getByTitle(title){
    let out = []
    return new Promise((resolve,reject)=>{
        for (var isbn in books) {
            if (books[isbn]['title'] == title) {
                out.push(books[isbn])
            }
        }
        if (out.length > 0) {
            resolve(out);
        }
        else {
            reject("No books found named "+title);
        }
    })
}


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getAllBooks().then(
        (book)=>res.send(JSON.stringify(book, null, 4)),
        (error) => res.send("An error occurred fetching books:"+error)
    );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getByISBN(isbn).then(
    (book)=>res.send(JSON.stringify(book, null, 4)),
    (error) => res.send("An error occurred fetching books:"+error)
    );
 });
 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getByAuthor(author).then(
        (out) =>res.send(JSON.stringify(out, null, 4)),
        (error) => res.send("An error occurred fetching books:"+error)
    );
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getByTitle(title).then(
        (out) =>res.send(JSON.stringify(out, null, 4)),
        (error) => res.send("An error occurred fetching books:"+error)
    );
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


module.exports.general = public_users;
