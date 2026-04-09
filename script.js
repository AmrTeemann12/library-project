const myLibrary = [];

function Book(title, author, pages, read, score) {
    if(!new.target){
        throw Error ('use "new" keyword for constructor invocation')
    }

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.score = score;
    this.id = crypto.randomUUID();
}

const libraryElem = document.querySelector('.library')

function addBookToLibrary (book){

    let repeated = false;
    myLibrary.forEach(savedBook => {
        if(book.title === savedBook.title &&
            book.author === savedBook.author){
            console.log('the book already exists');
            repeated = true;
        }
    })
    if (repeated) return;

    myLibrary.push(book);

    const bookAdded = new CustomEvent("update");
    libraryElem.dispatchEvent(bookAdded);
}

function displayBooks (library){
    libraryElem.innerHTML = ""
    library.forEach(book => {
        const card = document.createElement('div');
        for(let key in book){
            if (key === "id") continue;
            const elem = document.createElement('div')
            elem.textContent = `${key[0].toUpperCase()+key.slice(1)}: ${book[key]}`
            card.appendChild(elem);
        }
        
        libraryElem.appendChild(card);
        card.classList.add('card')
    });
}

function removeBook (book){
    const index = myLibrary.findIndex(savedBook => savedBook.id === book.id);
    if (index !== -1){
        myLibrary.splice(index, 1);

        const bookRemoved = new CustomEvent('update');
        libraryElem.dispatchEvent(bookRemoved)
    }
}

libraryElem.addEventListener('update', () => displayBooks(myLibrary))
