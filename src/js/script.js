/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    containerOf: {
      books:  '.books-list',
    },

    templateOf: {
      book: '#template-book',
    },

    imageOf: {
      book: '.books-list .book__image',
    },

    formOf: {
      filters: '.filters',
    },
    
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };


  class BookList {
    constructor(){
      this.filters = [];
      this.favoriteBooks = [];
      this.initData();
      this.renderBooks();
      this.getElements();
      this.initActions();
    }

    initData(){
      this.data = dataSource.books;
    }

    getElements(){
      this.bookList = document.querySelector(select.containerOf.books);
      this.filtersForm = document.querySelector(select.formOf.filters);
    }
    
    renderBooks(){
      for(const book of this.data){
        const ratingBgc = this.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        book.ratingBgc = ratingBgc;
        book.ratingWidth = ratingWidth;

        const generatedHTML = templates.book(book);
        this.element = utils.createDOMFromHTML(generatedHTML);
        const booksContainer = document.querySelector(select.containerOf.books);
        booksContainer.appendChild(this.element);
      }  
    }
  
    initActions(){
      this.bookList.addEventListener('click', (event) => {
        event.preventDefault();
      });
      
      this.bookList.addEventListener('dblclick', (event) =>{
        const parentNode = event.target.offsetParent;
        if(parentNode.classList.contains('book__image')){
          const bookId = parentNode.getAttribute('data-id');
          if(!this.favoriteBooks.includes(bookId)){
            this.favoriteBooks.push(bookId);
            parentNode.classList.add('favorite');
          }else{
            parentNode.classList.remove('favorite');
            const indexToRemove = this.favoriteBooks.indexOf(bookId);
            this.favoriteBooks.splice(indexToRemove, 1);
          }
        }
      });

      
      this.filtersForm.addEventListener('click', (event) =>{
        if(event.target.checked){
          this.filters.push(event.target.value);
        }else{
          const indexToRemove = this.filters.indexOf(event.target);
          this.filters.splice(indexToRemove, 1);
        }
        this.filterBooks();
      });
    }
  
    filterBooks(){
      for(const book of this.data){
        let shouldBeHidden = false;
        for(const filter of this.filters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden)
          document.querySelector('.book__image[data-id="' + book.id + '"]').classList.add('hidden');
        else
          document.querySelector('.book__image[data-id="' + book.id + '"]').classList.remove('hidden');
      }
    }
  
    determineRatingBgc(rating){
      if(rating < 6)
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      else if(rating > 6 && rating <= 8)
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      else if(rating > 8 && rating <= 9)
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      else
        return 'linear-gradient(to bottom, #ff0084 0% ,#ff0084 100%)';
    }
  }
 
  new BookList();

  
}