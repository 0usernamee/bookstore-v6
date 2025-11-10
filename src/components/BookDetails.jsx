import React, { useEffect, useMemo, useState } from 'react';
import './BookDetails.css';

const BookDetails = ({ book, onClose }) => {
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = useMemo(() => {
    if (!book) return '';
    if (book.title) return book.title;
    if (book.author) return book.author;
    if (book.publisher) return book.publisher;
    return '';
  }, [book]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSimilarBooks = async () => {
      if (!query) {
        setSimilarBooks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://api.itbook.store/1.0/search/${encodedQuery}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch similar books (${response.status})`);
        }
        const data = await response.json();
        setSimilarBooks(Array.isArray(data.books) ? data.books.slice(0, 6) : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching similar books:', err);
          setError('Could not load similar books.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarBooks();

    return () => controller.abort();
  }, [query]);

  if (!book) {
    return null;
  }

  return (
    <div className="book-details-view">
      <div className="catalog-header">
        <h1>Book Catalog</h1>
        <button className="edit-button" onClick={onClose}>BACK TO LIST</button>
      </div>

      <div className="book-details-content">
        <div className="book-details-cover">
          {book.coverImage ? (
            <img src={book.coverImage} alt={`${book.title} cover`} onError={(e) => { e.target.style.visibility = 'hidden'; }} />
          ) : (
            <div className="book-cover-placeholder">
              <span>No Cover</span>
            </div>
          )}
        </div>
        <div className="book-details-info">
          <h2>{book.title || 'Untitled'}</h2>
          {book.subtitle ? <p className="book-details-subtitle">{book.subtitle}</p> : null}
          <ul className="book-details-metadata">
            <li><strong>Author:</strong> {book.author || 'Unknown'}</li>
            <li><strong>Publisher:</strong> {book.publisher || 'Unknown'}</li>
            <li><strong>Publication Year:</strong> {book.publicationYear || 'Unknown'}</li>
            <li><strong>Language:</strong> {book.language || 'Unknown'}</li>
            <li><strong>Pages:</strong> {book.pages || 'Unknown'}</li>
            <li><strong>Price:</strong> {book.price || 'N/A'}</li>
            {book.isbn ? <li><strong>ISBN:</strong> {book.isbn}</li> : null}
          </ul>
        </div>
      </div>

      <div className="similar-books-section">
        <h3>Similar Books</h3>
        {loading && <p>Loading similar books...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && similarBooks.length === 0 && <p>No similar books found.</p>}
        <div className="similar-books-grid">
          {similarBooks.map((similar) => (
            <div key={similar.isbn13} className="similar-book-card">
              <div className="similar-book-cover">
                {similar.image ? (
                  <img src={similar.image} alt={`${similar.title} cover`} />
                ) : (
                  <div className="book-cover-placeholder">
                    <span>No Cover</span>
                  </div>
                )}
              </div>
              <div className="similar-book-info">
                <h4>{similar.title}</h4>
                {similar.subtitle ? <p className="similar-book-subtitle">{similar.subtitle}</p> : null}
                <p className="similar-book-price">{similar.price}</p>
                <a href={similar.url} target="_blank" rel="noopener noreferrer">More info</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;


