
import { BookDocument } from '../models/Book.js';
import User from '../models/User.js';

const resolvers = {
  Query: {
    // Query to get all users
    users: async () => {
      return await User.find({});
    },
    // Query to get all books from all users' savedBooks
    books: async () => {
      const users = await User.find({});
      return users.flatMap(user => user.savedBooks);
    },
    // Query to get a single book by ID from all users' savedBooks
    book: async (_parent: any, { id }: { id: string }) => {
      const users = await User.find({});
      for (const user of users) {
        const book = user.savedBooks.find(book => book.bookId === id);
        if (book) return book;
      }
      return null;
    },
  },
  Mutation: {
    // Mutation to add a new book to a user's savedBooks
    addBook: async (_parent: any, { userId, book }: { userId: string; book: BookDocument }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
      user.savedBooks.push(book);
      await user.save();
      return book;
    },
    // Mutation to update a book by ID in a user's savedBooks
    updateBook: async (_parent: any, { userId, bookId, book }: { userId: string; bookId: string; book: Partial<BookDocument> }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
      const bookIndex = user.savedBooks.findIndex(b => b.bookId === bookId);
      if (bookIndex === -1) throw new Error('Book not found');
      user.savedBooks[bookIndex] = { ...user.savedBooks[bookIndex].toObject(), ...book };
      await user.save();
      return user.savedBooks[bookIndex];
    },
    // Mutation to delete a book by ID from a user's savedBooks
    deleteBook: async (_parent: any, { userId, bookId }: { userId: string; bookId: string }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
      const bookIndex = user.savedBooks.findIndex(b => b.bookId === bookId);
      if (bookIndex === -1) throw new Error('Book not found');
      const [deletedBook] = user.savedBooks.splice(bookIndex, 1);
      await user.save();
      return deletedBook;
    },
  },
};

export default resolvers;
