import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($username: String, $email: String, $password: String!) {
    login(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($userId: ID!, $book: BookInput!) {
    saveBook(userId: $userId, book: $book) {
      id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($userId: ID!, $bookId: ID!) {
    deleteBook(userId: $userId, bookId: $bookId) {
      id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;