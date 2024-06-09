const {
  addBookHandler,
  getAllBooksHandler,
  getBookDetailsByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  // menambahkan buku
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  // menampilkan seluruh buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  // menampilkan detail buku
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookDetailsByIdHandler,
  },
  // mengubah data buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  // menghapus data buku
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
