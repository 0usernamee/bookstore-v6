import React, { useState } from 'react';
import './AddBookModal.css';

const AddBookModal = ({ isOpen, onClose, onAddBook, editingBook, onEditBook }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publicationYear: '',
    language: '',
    pages: '',
    coverImage: ''
  });

  // Populate form when editing a book
  React.useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        publisher: editingBook.publisher || '',
        publicationYear: editingBook.publicationYear || '',
        language: editingBook.language || '',
        pages: editingBook.pages || '',
        coverImage: editingBook.coverImage || ''
      });
    } else {
      setFormData({
        title: '',
        author: 'by ',
        publisher: '',
        publicationYear: '',
        language: '',
        pages: '',
        coverImage: ''
      });
    }
  }, [editingBook]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBook) {
      onEditBook(formData);
    } else {
      onAddBook(formData);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      title: '',
      author: '',
      publisher: '',
      publicationYear: '',
      language: '',
      pages: '',
      coverImage: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{editingBook ? 'Edit Book' : 'Add Book'}</h2>
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="book title..."
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Author"
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              placeholder="Publisher"
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="publicationYear">Publication Year</label>
            <input
              type="text"
              id="publicationYear"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="language">Language</label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              placeholder="Language"
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="pages">Pages</label>
            <input
              type="text"
              id="pages"
              name="pages"
              value={formData.pages}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <button type="submit" className="save-btn">
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
