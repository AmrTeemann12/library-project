const myLibrary = [];
const libraryElem = document.querySelector('.library');
const addBookBtn = document.querySelector('.add-book');
const closeDialog = document.querySelector('.close-dialog');
const dialog = document.querySelector('#new-book');
const form = document.querySelector('#book-form');
const errorDiv = document.querySelector('.error-container');
const errorPara = document.querySelector('.error-message');

class Book {
    constructor(title, author, pages, status){
        if(!new.target){
            throw Error ('use "new" keyword for constructor invocation')
        }

        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
        this.id = crypto.randomUUID();
    }
}

function addBookToLibrary (book){
    let repeated = false;
    myLibrary.forEach(savedBook => {
        if(book.title === savedBook.title &&
            book.author === savedBook.author){
            console.warn('the book already exists');
            repeated = true;
        }
    })
    if (repeated) return false;

    myLibrary.push(book);

    const bookAdded = new CustomEvent("update");
    libraryElem.dispatchEvent(bookAdded);
    return true;
}

function displayBooks (library){
    libraryElem.innerHTML = "";

    library.forEach(book => {
        const card = document.createElement('div');
        const titleElem = document.createElement('span');
        const authorElem = document.createElement('span');
        const pagesElem = document.createElement('span');
        const statusElem = document.createElement('button');
        const removeBtn = document.createElement('button');

        titleElem.textContent = `"${book.title}"`;
        authorElem.textContent = book.author;
        pagesElem.textContent = book.pages? `${book.pages} pages`: '';
        statusElem.textContent = book.status;
        removeBtn.textContent = "Delete Book";

        card.append(titleElem, authorElem, pagesElem, statusElem, removeBtn)
        
        titleElem.classList.add('title-span');
        authorElem.classList.add('author-span');
        pagesElem.classList.add('pages-span');
        statusElem.classList.add('status-btn');
        statusElem.classList.add(`${book.status.split(' ').join('-')}`)
        removeBtn.classList.add('remove-btn');
        
        removeBtn.setAttribute('title', 'delete the book permanently')
        statusElem.setAttribute('title', 'reading status')

        statusElem.addEventListener('click', () => {
            let newStatus;

            switch(book.status){
                case 'not started':
                    newStatus = 'in progress';
                break;
                case 'in progress':
                    newStatus = 'finished';
                break;
                case 'finished':
                    newStatus = 'not started';
                break;
            }
            book.status = newStatus;
            statusElem.textContent = newStatus;
            statusElem.classList.remove('not-started', 'in-progress', 'finished');
            statusElem.classList.add(`${newStatus.split(' ').join('-')}`)
        })

        removeBtn.addEventListener('click', (e) => {
            const cardId = e.target.parentElement.dataset.id;
            removeBook(cardId);
            e.target.parentElement.remove()
        })

        libraryElem.appendChild(card);
        card.classList.add('card')
        card.dataset.id = book.id;
    });
}

function removeBook (id){
    const index = myLibrary.findIndex(book => book.id === id);
    if (index !== -1){
        myLibrary.splice(index, 1);
    }
}

function resetForm (){
    errorDiv.classList.remove('active')
    errorPara.textContent = '';
    form.reset(); 
}

function showError (message){
    errorDiv.classList.add('active')
    errorPara.textContent = '';
    errorPara.textContent = message;
}

libraryElem.addEventListener('update', () => displayBooks(myLibrary))

closeDialog.addEventListener('click', resetForm)

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
        const invalidElm = form.querySelector(':invalid');
        
        setValidity(invalidElm);
        form.reportValidity();
        return;
    }

    const newTitle = document.querySelector('#title').value;
    const newAuthor = document.querySelector('#author').value;
    const newPages = document.querySelector('#pages').value;
    const newStatus = document.querySelector('input[name="status"]:checked').value;

    const newBook = new Book(newTitle, newAuthor, newPages, newStatus);

    if(!addBookToLibrary(newBook)){
        showError(`${newTitle} by ${newAuthor} already exists`);
        return;
    }

    dialog.close();
    resetForm();
});

form.addEventListener('input', (e) => {
    e.target.setCustomValidity('');
})

function setValidity(elm) {
    if(elm.validity.valueMissing) {
        elm.setCustomValidity(`The ${elm.name} field must be filled`);
    } else if(elm.validity.rangeUnderflow) {
        elm.setCustomValidity(`The minimum value for ${elm.name} is ${elm.min}`);
    } else if(elm.validity.rangeOverflow) {
        elm.setCustomValidity(`The maximum value for ${elm.name} is ${elm.max}`);
    }
}

const book1 = new Book('Tea Types and Methods', 'Tea Sage', 212, 'finished');
const book2 = new Book('The Cat Way For Doing Things', 'R.G.Cat', 123, 'not started');
const book3 = new Book('The Secret Of Drinking Two Cups Of Tea At The Same Time', 'A.T.Sage', 74, 'in progress');

addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);
displayBooks(myLibrary);
resetForm()