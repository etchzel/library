function Library() {
    this.books = [];
};

Library.prototype.setLibrary = function (item) {
    this.books = item;
};

Library.prototype.getLibrary = function () {
    return this.books;
};

Library.prototype.addBook = function (book) {
    this.books.push(book);
};

Library.prototype.saveBook = function () {
    localStorage.setItem('library', JSON.stringify(this.books));
};

Library.prototype.deleteBook = function (id) {
    this.books = this.books.filter(book => book.id !== id);
};

export default Library;
