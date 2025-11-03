import React, { useMemo, useState } from 'react';
import './LoanManager.css';

const LoanManager = ({ books, loans, onCreateLoan, onQuit }) => {
  const [borrower, setBorrower] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [weeks, setWeeks] = useState(1);

  const availableBooks = useMemo(() => {
    const loanedBookIds = new Set(loans.map(l => l.bookId));
    return books.filter(b => !loanedBookIds.has(b.id));
  }, [books, loans]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!borrower.trim() || !selectedBookId) return;
    const start = new Date();
    const due = new Date(start);
    due.setDate(start.getDate() + Number(weeks) * 7);
    const dueDate = due.toISOString().slice(0, 10);
    onCreateLoan({ borrower: borrower.trim(), bookId: selectedBookId, dueDate });
    setBorrower('');
    setSelectedBookId('');
    setWeeks(1);
  };

  return (
    <div className="loan-manager">
      <div className="catalog-header">
        <h1>Book Catalog</h1>
        <button className='delete-button' onClick={onQuit}>QUIT</button>
      </div>

      <div className="loan-container">
        {availableBooks.length === 0 ? (
          <p>There are no available books to borrow</p>
        ) : (
          <form onSubmit={handleSubmit} className="loan-form">
            <div className="form-row">
              <label htmlFor="borrower">Borrower</label>
              <input
                id="borrower"
                type="text"
                value={borrower}
                onChange={(e) => setBorrower(e.target.value)}
                placeholder="Name"
              />
            </div>

            <div className="form-row">
              <label htmlFor="book">Book</label>
              <select
                id="book"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
              >
                <option value="">Select a book</option>
                {availableBooks.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="weeks">Loan period (weeks)</label>
              <input
                id="weeks"
                type="number"
                min={1}
                max={4}
                value={weeks}
                onChange={(e) => setWeeks(Math.max(1, Math.min(4, Number(e.target.value))))}
              />
            </div>

            <button type="submit" className="save-btn">Create Loan</button>
          </form>
        )}

        <div className="loans-section">
          <h2>Currently on loan</h2>
          {loans.length === 0 ? (
            <p>No active loans</p>
          ) : (
            <div>
              {loans.map(loan => {
                const book = books.find(b => b.id === loan.bookId);
                return (
                  <div key={loan.bookId} className="loan-item">
                    <p>Borrower: {loan.borrower}</p>
                    <p>Book: {book ? book.title : loan.bookId}</p>
                    <p>Due date: {loan.dueDate}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanManager;


