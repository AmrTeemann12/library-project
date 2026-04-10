const myLibrary = [];
const libraryElem = document.querySelector('.library');
const addBookBtn = document.querySelector('.add-book');
const closeDialog = document.querySelector('#close-dialog');
const dialog = document.querySelector('#new-book');
const form = document.querySelector('#book-form');
const errorDiv = document.querySelector('.error-message');

function Book(title, author, pages, status) {
    if(!new.target){
        throw Error ('use "new" keyword for constructor invocation')
    }

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.id = crypto.randomUUID();
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
    if (repeated) return;

    myLibrary.push(book);

    const bookAdded = new CustomEvent("update");
    libraryElem.dispatchEvent(bookAdded);
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

        const bookRemoved = new CustomEvent('update');
        libraryElem.dispatchEvent(bookRemoved);
    }
}

libraryElem.addEventListener('update', () => displayBooks(myLibrary))

closeDialog.addEventListener('click', resetForm)

addBookBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const initialLibrary = myLibrary.length;
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const newTitle = document.querySelector('#title').value;
    const newAuthor = document.querySelector('#author').value;
    const newPages = document.querySelector('#pages').value;
    const newStatus = document.querySelector('input[name="status"]:checked').value;

    const newBook = new Book(newTitle, newAuthor, newPages, newStatus);
    addBookToLibrary(newBook);

    if(myLibrary.length === initialLibrary){
        showError(`${newTitle} by ${newAuthor} already exists`);
        return;
    }

    resetForm();
    dialog.close();
})

function resetForm (){
    errorDiv.innerHTML = '';
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#pages').value = '';
    const defaultRadio = document.querySelector('#not-started');
    defaultRadio.checked = true;   
}

function showError (message){
    errorDiv.innerHTML = '';
    
    const errorText = document.createElement('p')
    errorText.textContent = message;
    errorDiv.appendChild(errorText);
}

const book1 = new Book('Tea Types and Methods', 'Tea Sage', 212, 'finished');
const book2 = new Book('The Cat Way For Doing Things', 'R.G.Cat', 123, 'not started');
const book3 = new Book('The Secret Of Drinking Two Cups Of Tea At The Same Time', 'A.T.Sage', 74, 'in progress');

addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);
displayBooks(myLibrary);
