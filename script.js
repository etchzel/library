let library = [];

function Book(
    id = 0,
    title='Unknown',
    author='Unknown',
    numPages=0,
    currentPage=0
) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.currentPage = currentPage;
    this.isFinished = (currentPage === numPages) ? true : false;
};

const mainContainer = document.querySelector('.main');
const addButton = document.querySelector('.add-button');
const addWrapper = document.querySelector('.add-wrapper');
const addButtonLabel = document.querySelector('.add-button-label');
const titleInput = document.getElementById('addBookTitle');
const authorInput = document.getElementById('addBookAuthor');
const currentPageInput = document.getElementById('addBookCurrentPage');
const totalPageInput = document.getElementById('addBookTotalPages');
const addSubmitButton = document.querySelector('.add-confirm-button');
const cancelAddButton = document.getElementById('cancelAdd');

const addBookToLibrary = (...books) => {
    books.forEach(book => library.push(book));
};

const displayLibrary = () => {
    library.forEach((book) => console.log(book));
};

const removeBook = (e) => {
    e.stopPropagation();
    const parentElement = e.target.parentElement;
    //todo remove the book in the array
    const deleteId = +parentElement.getAttribute('data-id');
    const deleteIndex = library.findIndex((book) => {
        return book.id === deleteId;
    });
    library.splice(deleteIndex, 1);

    // update storage, if array empty clear storage
    saveBook();
    if(library.length === 0) localStorage.clear();

    parentElement.remove();
};

const generateId = () => {
    if (library.length === 0) return 0;
    console.log(library[library.length-1]);
    const lastBook = library[library.length-1];
    return lastBook.id + 1;
}

const createBookContainer = (id) => {
    const bookIndex = library.findIndex(book => book.id === id);
    const book = library[bookIndex];
    console.log(book);

    // container
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-container');
    bookContainer.setAttribute('data-id', `${id}`);

    const cancelButton = document.createElement('span');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = '×';
    cancelButton.addEventListener('click', removeBook);

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
    bookCurrentPage.textContent = `Current page: ${book.currentPage}`;

    // insert the elements to the main container
    mainContainer.insertBefore(bookContainer, mainContainer.lastElementChild);

};

const clearInputValues = () => {
    titleInput.value = '';
    authorInput.value = '';
    totalPageInput.value = '';
    currentPageInput.value = '';
};

const getBookInput = () => {
    const newBook = new Book(
        generateId(),
        titleInput.value,
        authorInput.value,
        totalPageInput.value,
        currentPageInput.value,
    );
    
    addBookToLibrary(newBook);
    createBookContainer(newBook.id);
    clearInputValues();
    saveBook();
    console.log(library);
};

const saveBook = () => {
    localStorage.setItem('library', JSON.stringify(library));
};

const loadBook = () => {
    const books = JSON.parse(localStorage.getItem('library'))
    if (books) {
        library = books.map((book) => {
            return new Book(
                book.id,
                book.title,
                book.author,
                book.numPages,
                book.currentPage
            );
        });
    } else {
        library = [];
    };
};

const addBookFormDisplay = () => {
    if (addButton.classList.contains('active')) return;
    addButton.classList.add('active');
    addButtonLabel.classList.add('hide');
    addWrapper.classList.remove('hidden');
};

const removeBookFormDisplay = () => {
    if (!addButton.classList.contains('active')) return;
    addButton.classList.remove('active');
    addButtonLabel.classList.remove('hide');
    addWrapper.classList.add('hidden');
};

addButton.addEventListener('click', addBookFormDisplay);

addSubmitButton.addEventListener('click', (e) => {
    e.stopPropagation();
    removeBookFormDisplay();
    getBookInput();
});

totalPageInput.addEventListener('input', () => {
    if (currentPageInput.value === '' &&
        totalPageInput.value !== '') {
        currentPageInput.classList.add('input-not-validated');
    } else {
        currentPageInput.classList.remove('input-not-validated');
    }
})

currentPageInput.addEventListener('input', () => {
    if(+totalPageInput.value < +currentPageInput.value ||
        currentPageInput.value === '') {
        currentPageInput.classList.add('input-not-validated');
    } else {
        currentPageInput.classList.remove('input-not-validated');
    }
});

cancelAddButton.addEventListener('click', (e) => {
    e.stopPropagation();
    removeBookFormDisplay();
    clearInputValues();
});

window.onload = function() {
    loadBook();
    if (library.length > 0) {
        library.forEach((book) => {
            createBookContainer(book.id);
        });
    };
};