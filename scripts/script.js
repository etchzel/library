import Book from './Book.js'
import Library from './Library.js';
import createBookContainer from './bookContainer.js';

const library = new Library();
let isEditing = false;

// HTML ELEMENTS

// main component
const mainContainer = document.querySelector('.main');
const addButton = document.querySelector('.add-button');
const addButtonLabel = document.querySelector('.add-button-label');

// add form wrapper component
const addWrapper = document.querySelector('.add-wrapper');
const titleInput = document.getElementById('addBookTitle');
const authorInput = document.getElementById('addBookAuthor');
const totalPageInput = document.getElementById('addBookTotalPages');
const datePublishedInput = document.getElementById('addBookDatePublished');
const markReadInput = document.getElementById('addBookMarkRead');
const addSubmitButton = document.getElementById('addSubmit');
const cancelAddButton = document.getElementById('cancelAdd');

// edit form wrapper component
const editWrapper = document.querySelector('.edit-wrapper');
const editCancelButton = editWrapper.firstElementChild;
const editTitleInput = document.getElementById('editBookTitle');
const editAuthorInput = document.getElementById('editBookAuthor');
const editTotalPageInput = document.getElementById('editBookTotalPages');
const editDatePublishedInput = document.getElementById('editBookDatePublished');
const editMarkReadInput = document.getElementById('editBookMarkRead');
const editSubmitButton = document.getElementById('editSubmit');


// DOM RELATED FUNCTIONS

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
    loadBookContainer(newBook);
};

const removeBook = (e) => {
    e.stopPropagation();
    if (isEditing) return;
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

const loadBookContainer = (book) => {
    const bookContainer = createBookContainer(book);
    mainContainer.insertBefore(
        bookContainer, 
        mainContainer.lastElementChild
    );

    const editBtn = document.querySelector(`.edit-button[data-id='${book.id}']`);

    // event listeners for new component
    bookContainer.firstElementChild.addEventListener('click', removeBook);
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isEditing) return;
        Array.from(bookContainer.children).forEach((elem) => {
            elem.classList.add('hidden');
        });
        bookContainer.appendChild(editWrapper);
        editBookFormDefault(book);
        editWrapper.classList.remove('hidden');
        isEditing = !isEditing;
    });
};

const editFormRemove = (container) => {
    Array.from(container.children).forEach((elem) => {
        if (elem !== editWrapper) {
            elem.classList.remove('hidden');
        } else {
            elem.classList.add('hidden');
        }
    });
};

const editBookFormDefault = (book) => {
    editTitleInput.value = book.title;
    editAuthorInput.value = book.author;
    editTotalPageInput.value = book.numPages;
    editDatePublishedInput.valueAsNumber = book.datePublished;
    editMarkReadInput.checked = book.isFinished;
};

const clearInputValues = () => {
    titleInput.value = '';
    authorInput.value = '';
    totalPageInput.value = '';
    datePublishedInput.value = '';
    markReadInput.checked = false;
};

const addBookFormDisplay = () => {
    if (isEditing) return;
    if (addButton.classList.contains('active')) return;
    addButton.classList.add('active');
    addButtonLabel.classList.add('hide');
    addWrapper.classList.remove('hidden');
    isEditing = !isEditing;
};

const removeBookFormDisplay = () => {
    if (!addButton.classList.contains('active')) return;
    addButton.classList.remove('active');
    addButtonLabel.classList.remove('hide');
    addWrapper.classList.add('hidden');
    isEditing = !isEditing;
};

// EVENT HANDLERS

const addSubmitHandler = (e) => {
    e.stopPropagation();
    removeBookFormDisplay();
    getBookInput();
    clearInputValues();
};

const addCancelHandler = (e) => {
    e.stopPropagation();
    clearInputValues();
    removeBookFormDisplay();
};

const editSubmitHandler = (e) => {
    e.stopPropagation();
    const container = e.target.parentElement.parentElement.parentElement;
    const editId = +container.dataset.id;
    const book = library.books.find(book => book.id === editId);
    book.setProperties({
        id: editId,
        title: editTitleInput.value,
        author: editAuthorInput.value,
        numPages: editTotalPageInput.value,
        datePublished: editDatePublishedInput.valueAsNumber,
        isFinished: editMarkReadInput.checked
    });

    if (book.isFinished) {
        container.classList.add('read');
    } else {
        container.classList.remove('read');
    }

    const displayedPropertyList = [
        book.title, 
        `By: ${book.author}`,
        `Number of pages: ${book.numPages}`,
        `Published: ${book.getPublishDate()}`
    ];

    const contents = container.children[1].children;
    Array.from(contents).forEach((elem, index) => {
        elem.textContent = displayedPropertyList[index];
    });
    editFormRemove(container);
    library.saveBook();
    isEditing = !isEditing;
};

const editCancelHandler = (e) => {
    e.stopPropagation();
    const container = e.target.parentElement.parentElement;
    const dataId = +container.getAttribute('data-id');
    const readStatus = library.books.find(book => book.id === dataId).isFinished;
    editFormRemove(container);
    if (readStatus != container.classList.contains('read')) {
        container.classList.toggle('read');
    };
    isEditing = !isEditing;
};

const markReadToggleHandler = (e) => {
    e.stopPropagation();
    const container = e.target
        .parentElement
        .parentElement
        .parentElement
        .parentElement
        .parentElement
        .parentElement
    container.classList.toggle('read')
};

// EVENT LISTENERS

addButton.addEventListener('click', addBookFormDisplay);
addSubmitButton.addEventListener('click', addSubmitHandler);
cancelAddButton.addEventListener('click', addCancelHandler);
editSubmitButton.addEventListener('click', editSubmitHandler);
editCancelButton.addEventListener('click', editCancelHandler);
editMarkReadInput.addEventListener('click', markReadToggleHandler)

// ON LOAD
window.onload = () => {
    library.setLibrary(loadBooks());
    console.log(library.books);
    if (library.getLibrary().length > 0) {
        library.getLibrary().forEach(book => loadBookContainer(book));
    };
};