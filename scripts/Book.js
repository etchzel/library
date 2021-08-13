function Book({
    id=0,
    title='Unknown',
    author='Unknown',
    numPages=0,
    datePublished=0,
    isFinished=true
}={}) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.datePublished = datePublished;
    this.isFinished = isFinished;
};

Book.prototype.setProperties = function (book) {
    this.id = book.id;
    this.title = book.title;
    this.author = book.author;
    this.numPages = book.numPages;
    this.datePublished = book.datePublished;
    this.isFinished = book.isFinished;
};

Book.prototype.generateId = function (library) {
    if (library.length === 0) {
        this.id = 0;
    } else if (library.length > 0) {
        this.id = library[library.length-1].id + 1;
    };
};

Book.prototype.getPublishDate = function () {
    const dateString = new Date(this.datePublished).toUTCString();
    return dateString
        .split(' ')
        .slice(0,4)
        .join(' ');
};

export default Book;
