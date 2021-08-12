import Book from './Book.js'
import Library from './Library.js';
import createBookContainer from './bookContainer.js';

const library = new Library();

// HTML Elements

const mainContainer = document.querySelector('.main');
const addButton = document.querySelector('.add-button');
const addWrapper = document.querySelector('.add-wrapper');
const addButtonLabel = document.querySelector('.add-button-label');
const titleInput = document.getElementById('addBookTitle');
const authorInput = document.getElementById('addBookAuthor');
const datePublishedInput = document.getElementById('addBookDatePublished');
const totalPageInput = document.getElementById('addBookTotalPages');
const markReadInput = document.getElementById('addBookMarkRead');
const addSubmitButton = document.querySelector('.add-confirm-button');
const cancelAddButton = document.getElementById('cancelAdd');

// HANDLERS

const clearInputValues = () => {
    titleInput.value = '';
    authorInput.value = '';
    totalPageInput.value = '';
    datePublishedInput.value = '';
};

const removeBook = (e) => {
    e.stopPropagation();
    const parentElement = e.target.parentElement;
    const deleteId = +parentElement.getAttribute('data-id');
    library.deleteBook(deleteId);

    // update storage, if array empty clear storage
    library.saveBook();
    if(library.getLibrary().length === 0) localStorage.clear();

    parentElement.remove();
};

const loadBooks = () => {
    const books = JSON.parse(localStorage.getItem('library'))
    if (books) {
        return books.map((book) => {
            return new Book({...book});
        });
    } else {
        return [];
    };
};

const getBookInput = () => {
    const newBook = new Book({
        title: titleInput.value,
        author: authorInput.value,
        numPages: totalPageInput.value,
        datePublished: datePublishedInput.valueAsNumber,
        isFinished: markReadInput.checked
    });
    
    newBook.generateId(library.getLibrary());
    library.addBook(newBook);
    library.saveBook();
    const bookContainer = createBookContainer(newBook);
    bookContainer.firstElementChild.addEventListener(
        'click', removeBook
    );
    mainContainer.insertBefore(
        bookContainer, mainContainer.lastElementChild
    );

    clearInputValues();
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

// EVENT LISTENERS

addButton.addEventListener('click', addBookFormDisplay);

addSubmitButton.addEventListener('click', (e) => {
    e.stopPropagation();
    removeBookFormDisplay();
    getBookInput();
});

cancelAddButton.addEventListener('click', (e) => {
    e.stopPropagation();
    removeBookFormDisplay();
    clearInputValues();
});

window.onload = () => {
    library.setLibrary(loadBooks());
    console.log(library.books);
    if (library.getLibrary().length > 0) {
        library.getLibrary().forEach((book) => {
            const bookContainer = createBookContainer(book);
            bookContainer.firstElementChild.addEventListener(
                'click',
                removeBook
            );
            mainContainer.insertBefore(
                bookContainer, 
                mainContainer.lastElementChild
            );
        });
    };
};