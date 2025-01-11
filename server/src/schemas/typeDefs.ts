import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
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

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(id: ID!): User
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }

  input BookInput {
    bookId: ID!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }
`;

export default typeDefs;