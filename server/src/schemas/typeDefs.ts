const typeDefs =`
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
  }
`;
export default typeDefs;