import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import AddBookModal from './AddBookModal';
import './BookCatalog.css';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        // Read the JSON file using fetch
        const response = await fetch('/books.json');
        const data = await response.json();
        
        console.log('API Response:', JSON.stringify(data)); // helps me know how to call the api data
        // only need two books for now - can manipulate the slice data of the variable to increase the books - hopefully
        let booksW = data.slice(0, 0);
        
        const processedBooks = booksW.map((bookData, index) => {
          return {
            id: bookData.isbn13 || `book-${index}`,
            title: bookData.title,
            subtitle: bookData.subtitle || '',
            coverImage: bookData.image,
            price: bookData.price,
            isbn: bookData.isbn13,
            url: bookData.url
          };
        });
        
        console.log('Processed books:', processedBooks);
        setBooks(processedBooks);
        setLoading(false);
        
      } catch (error) {
        console.error('Error loading books from JSON file:', error);
        setError(error.message);
        setLoading(false);
        // displays if the api fails for whatever reason
      }
    };

    loadBooks();
  }, []);

  const handleLearnMore = (book) => {
    console.log('Learn more about:', book.title);
    if (book.url) {
      window.open(book.url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Learn more about "${book.title}" for ${book.price}\n\nDescription: ${book.description}`);
    }
  };

  const handleBookSelect = (bookId) => {
    setSelectedBookId(selectedBookId === bookId ? null : bookId);
  };

  const handleRemoveBook = (bookId) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    // Clear selection if the selected book is removed
    if (selectedBookId === bookId) {
      setSelectedBookId(null);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteSelected = () => {
    if (!selectedBookId) return;
    setBooks(prev => prev.filter(b => b.id !== selectedBookId));
    setSelectedBookId(null);
  };

  if (loading) {
    return (
      <div className="book-catalog">
        <div className="catalog-header">
          <h1>Book Catalog</h1>
        </div>
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-catalog">
        <div className="catalog-header">
          <h1>Book Catalog</h1>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="book-catalog">
      <div className="catalog-header">
        <h1>Book Catalog</h1>
      </div>
      <div className="catalog-layout">
        <div className="add-button-column">
          <button className='add-button' onClick={handleOpenModal}>New</button>
          <button className='edit-button' onClick={() => { /* edit no-op for now */ }}>EDIT</button>
          <button className='delete-button' onClick={handleDeleteSelected}>DELETE</button>
        </div>
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onLearnMore={handleLearnMore}
              isSelected={selectedBookId === book.id}
              onSelect={handleBookSelect}
            />
          ))}
        </div>
      </div>
      <div className="catalog-footer">
        <p className='footer-text'>Diego Breakfast</p>
      </div>
      <AddBookModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddBook={(formData) => {
          const newBook = {
            id: `book-${Date.now()}`,
            title: formData.title || 'Untitled',
            subtitle: '',
            coverImage: '',
            price: '',
            isbn: '',
            url: '',
            author: formData.author,
            publisher: formData.publisher,
            publicationYear: formData.publicationYear,
            language: formData.language,
            pages: formData.pages
          };
          setBooks(prev => [newBook, ...prev]);
        }}
      />
    </div>
  );
};

export default BookCatalog;