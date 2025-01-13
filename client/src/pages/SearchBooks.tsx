import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Col, Form, Button, Row, Modal, Tab, Nav } from 'react-bootstrap';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import type { Book } from '../models/Book';
import type { User } from '../models/User';
import type { GoogleAPIBook } from '../models/GoogleAPIBook';
import { useMutation, useQuery } from '@apollo/client';
import { SAVE_BOOK, REMOVE_BOOK } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';
import SignUpForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';
import '../App.css'; // Import the custom CSS file

const SearchBooks = () => {
  const navigate = useNavigate();
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState<string[]>(getSavedBookIds());
  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  // useMutation hook for SAVE_BOOK mutation
  const [saveBook] = useMutation(SAVE_BOOK);

  // useMutation hook for REMOVE_BOOK mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  // useQuery hook to execute GET_ME query on load
  const { data } = useQuery<{ me: User }>(GET_ME);
  const userData = data?.me;

  // create state for modal display
  const [showModal, setShowModal] = useState(false);

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!searchInput) {
      return;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('Can not fetch data');
      }

      const { items } = await response.json();

      const bookData = items.map((book: GoogleAPIBook) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail || '',
        
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId: string) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    if (!bookToSave) {
      return;
    }

    try {
      await saveBook({
        variables: { bookData: bookToSave },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      navigate('/saved'); // Navigate to the SavedBooks page
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
      });

      setSavedBookIds(savedBookIds.filter((id) => id !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light custom-background p-5">
        <Container>
          <h1>Search for Books</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                  className="custom-form-control"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" className="custom-button" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="custom-heading">
          {searchedBooks.length ? `Viewing ${Math.min(searchedBooks.length, 9)} results:` : 'Search for your favourite book to start.'}
        </h2>
        <Row>
          {searchedBooks.slice(0, 9).map((book) => (
            <Col md="4" key={book.bookId}>
              <div className="card mb-4">
                {book.image ? (
                  <img src={book.image} alt={`The cover for ${book.title}`} className="card-img-top" />
                ) : null}
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="small">Authors: {book.authors}</p>
                  <p className="card-text">{book.description}</p>
                  <a href={book.link} className="learn-more" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                  <a href={book.link} className="custom-link" target="_blank" rel="noopener noreferrer">
                    View on Google Books
                  </a>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className="custom-button"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book was saved previously'
                        : 'Save this Book'}
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      
      {userData && (
        <Container>
          <h2 className="custom-heading">Your Saved Books</h2>
          <Row>
            {userData.savedBooks.map((book) => (
              <Col md="4" key={book.bookId}>
                <div className="card mb-4">
                  {book.image ? (
                    <img src={book.image} alt={`The cover for ${book.title}`} className="card-img-top" />
                  ) : null}
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="small">Authors: {book.authors.join(', ')}</p>
                    <p className="card-text">{book.description}</p>
                    <a href={book.link} className="learn-more" target="_blank" rel="noopener noreferrer">
                      Learn More
                    </a>
                    <a href={book.link} className="custom-link" target="_blank" rel="noopener noreferrer">
                      View on Google Books
                    </a>
                    <Button
                      className="custom-button"
                      onClick={() => handleRemoveBook(book.bookId)}
                    >
                      Remove this Book
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      )}


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Log In</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default SearchBooks;
