/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const books = require('./books');

// menambahkan buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // penambahan buku gagal
  // tidak melampirkan nama
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // readPage lebih besar daripada pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // penambahan buku baru berhasil
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // gagal menambahkan buku karena alasan lainnya
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(404);
  return response;
};

// menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // filter buku
  let filterBook = books;

  // berdasarkan nama
  if (name !== undefined) {
    filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  // berdasarkan reading
  if (reading !== undefined) {
    filterBook = books.filter((book) => Number(book.reading) === Number(reading));
  }

  // berdasarkan finished
  if (finished !== undefined) {
    filterBook = books.filter((book) => Number(book.finished) === Number(finished));
  }

  // respons
  const response = h.response({
    status: 'success',
    data: {
      books: filterBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// menampilkan detail buku
const getBookDetailsByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const searchBookId = books.filter((book) => book.id === bookId)[0];

  // respon berhasil
  if (searchBookId !== undefined) {
    const book = searchBookId;
    const response = h.response({
      status: 'success',
      data: {
        book:
        {
          id: book.id,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished: book.finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.updatedAt,
        },
      },
    });
    response.code(200);
    return response;
  }

  // respon gagal
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// merubah buku
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  const index = books.findIndex((n) => n.id === bookId);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  // berhasil
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // gagal
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookDetailsByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
