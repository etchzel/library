const createBookContainer = (book) => {
    // container
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-container');
    bookContainer.setAttribute('data-id', `${book.id}`);

    if (book.isFinished) bookContainer.classList.add('read');

    const cancelButton = document.createElement('span');
    cancelButton.classList.add('delete-button');
    cancelButton.textContent = '×';

    // content
    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content');

    const bookTitle = document.createElement('h3');
    bookTitle.classList.add('book-title');

    const bookAuthor = document.createElement('span');
    bookAuthor.classList.add('book-author');

    const bookNumPages = document.createElement('span');
    bookNumPages.classList.add('num-pages');

    const bookCurrentPage = document.createElement('span');
    bookCurrentPage.classList.add('current-page');

    const bookContentElements = [
        bookTitle, bookAuthor, bookNumPages, bookCurrentPage
    ];

    // options
    const bookOptions = document.createElement('div');
    bookOptions.classList.add('options');

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.setAttribute('data-id', `${book.id}`);
    editButton.textContent = 'Edit';

    // construct the elements
    bookContentElements.forEach((elem) => bookContent.appendChild(elem));
    bookOptions.appendChild(editButton);
    bookContainer.appendChild(cancelButton);
    bookContainer.appendChild(bookContent);
    bookContainer.appendChild(bookOptions);

    // insert the element content
    bookTitle.textContent = book.title;
    bookAuthor.textContent = `By: ${book.author}`;
    bookNumPages.textContent = `Number of pages: ${book.numPages}`;
    bookCurrentPage.textContent = `Published: ${book.getPublishDate()}`;

    return bookContainer;
};

export default createBookContainer;
