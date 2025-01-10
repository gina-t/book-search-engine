import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  type Query {
    users: [User]
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    addBook(userId: ID!, book: BookInput!): Book
    updateBook(userId: ID!, bookId: ID!, book: BookInput!): Book
    deleteBook(userId: ID!, bookId: ID!): Book
  }

  input BookInput {
    bookId: ID!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }
`;

export default typeDefs;