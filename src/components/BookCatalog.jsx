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
  const [filterPublisher, setFilterPublisher] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load books from localStorage or from JSON file
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        
        // Check if books exist in localStorage
        const savedBooks = localStorage.getItem('books');
        console.log('Saved books from localStorage:', savedBooks);
        
        if (savedBooks && savedBooks !== '[]') {
          // Load from localStorage
          const parsedBooks = JSON.parse(savedBooks);
          console.log('Parsed books:', parsedBooks);
          setBooks(parsedBooks);
        } else {
          // Start with empty array if no localStorage data
          console.log('No saved books found, starting with empty array');
          setBooks([]);
        }
        
        setLoading(false);
        setIsInitialized(true);
        
      } catch (error) {
        console.error('Error loading books:', error);
        setError(error.message);
        setLoading(false);
        setIsInitialized(true);
      }
    };

    loadBooks();
  }, []);

  // Save books to localStorage whenever books change (but not on initial load)
  useEffect(() => {
    // Only save after initial load is complete
    if (isInitialized) {
      console.log('Saving books to localStorage:', books);
      localStorage.setItem('books', JSON.stringify(books));
    }
  }, [books, isInitialized]);

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
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleEditSelected = () => {
    if (!selectedBookId) return;
    const bookToEdit = books.find(b => b.id === selectedBookId);
    if (bookToEdit) {
      setEditingBook(bookToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedBookId) return;
    setBooks(prev => prev.filter(b => b.id !== selectedBookId));
    setSelectedBookId(null);
  };

  // Get unique publishers and languages for filter dropdowns
  const getUniqueValues = (key) => {
    const values = books
      .map(book => book[key])
      .filter(value => value && value.trim() !== '');
    return [...new Set(values)].sort();
  };

  // Filter books based on publisher and language
  const filteredBooks = books.filter(book => {
    const matchesPublisher = !filterPublisher || book.publisher === filterPublisher;
    const matchesLanguage = !filterLanguage || book.language === filterLanguage;
    return matchesPublisher && matchesLanguage;
  });

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
      <div className="filter-controls">
        <label htmlFor="filter-publisher">Filter by Publisher:</label>
        <select 
          id="filter-publisher" 
          value={filterPublisher} 
          onChange={(e) => setFilterPublisher(e.target.value)}
        >
          <option value="">All Publishers</option>
          {getUniqueValues('publisher').map(publisher => (
            <option key={publisher} value={publisher}>{publisher}</option>
          ))}
        </select>
        
        <label htmlFor="filter-language">Filter by Language:</label>
        <select 
          id="filter-language" 
          value={filterLanguage} 
          onChange={(e) => setFilterLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          {getUniqueValues('language').map(language => (
            <option key={language} value={language}>{language}</option>
          ))}
        </select>
      </div>
      <div className="catalog-layout">
        <div className="add-button-column">
          <button className='add-button' onClick={handleOpenModal}>New</button>
          <button className='edit-button' onClick={handleEditSelected}>EDIT</button>
          <button className='delete-button' onClick={handleDeleteSelected}>DELETE</button>
        </div>
        <div className="books-grid">
          {filteredBooks.map((book) => (
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
        editingBook={editingBook}
        onAddBook={(formData) => {
          const newBook = {
            id: `book-${Date.now()}`,
            title: formData.title || 'Untitled',
            subtitle: '',
            coverImage: formData.coverImage || '',
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
        onEditBook={(formData) => {
          if (!editingBook) return;
          setBooks(prev => prev.map(book => 
            book.id === editingBook.id 
              ? { ...book, ...formData }
              : book
          ));
        }}
      />
    </div>
  );
};

export default BookCatalog;