const Joi = require("joi");
const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(express.json());

const booksFilePath = path.join(__dirname, "BookDetails.json");

// Helper functions
const readBooks = async () => {
  const data = await fs.readFile(booksFilePath, "utf8");
  return JSON.parse(data);
};

const writeBooks = async (books) => {
  await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
};

const validateBook = (book) => {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    author: Joi.string().max(50).required(),
    year: Joi.number().integer().required(),
    genre: Joi.string().max(30).optional(),
  });
  return schema.validate(book);
};

// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).send(err.details[0].message);
  }
  res.status(500).send("Internal Server Error");
};

// Route handlers
const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const books = await readBooks();

    let filteredBooks = books;

    if (author) {
      filteredBooks = filteredBooks.filter((b) =>
        b.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (genre) {
      filteredBooks = filteredBooks.filter(
        (b) => b.genre && b.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    const totalBooks = filteredBooks.length;
    const totalPages = Math.ceil(totalBooks / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    res.send({
      totalBooks,
      totalPages,
      currentPage: page,
      books: filteredBooks.slice(startIndex, endIndex),
    });
  } catch {
    res.status(500).send("Error reading books");
  }
};

const getBookById = async (req, res) => {
  try {
    const books = await readBooks();
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send("Book not found");
    res.send(book);
  } catch {
    res.status(500).send("Error reading books");
  }
};

const createBook = async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const books = await readBooks();
    const newBook = { id: books.length + 1, ...req.body };
    books.push(newBook);
    await writeBooks(books);
    res.status(201).send(newBook);
  } catch {
    res.status(500).send("Error writing book");
  }
};

const updateBook = async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const books = await readBooks();
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send("Book not found");

    Object.assign(book, req.body);
    await writeBooks(books);
    res.send(book);
  } catch {
    res.status(500).send("Error updating book");
  }
};

const deleteBook = async (req, res) => {
  try {
    const books = await readBooks();
    const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).send("Book not found");

    const deletedBook = books.splice(bookIndex, 1);
    await writeBooks(books);
    res.send(deletedBook[0]);
  } catch {
    res.status(500).send("Error deleting book");
  }
};

// Route definitions
app.get("/books", getBooks);
app.get("/books/:id", getBookById);
app.post("/books", createBook);
app.put("/books/:id", updateBook);
app.delete("/books/:id", deleteBook);

// Error handling middleware
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
