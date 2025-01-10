import type { BookDocument } from '../models/Book.js';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    // Query to get all users
    users: async () => {
      try {
        return await User.find({});
      } catch (error) {
        throw new Error(`Error fetching users: ${(error as Error).message}`);
      }
    },
    // Query to get all books from all users' savedBooks
    books: async () => {
      try {
        const users = await User.find({});
        return users.flatMap(user => user.savedBooks);
      } catch (error) {
        throw new Error(`Error fetching books: ${(error as Error).message}`);
      }
    },
    // Query to get a single book by ID from all users' savedBooks
    book: async (_parent: any, { id }: { id: string }) => {
      try {
        const users = await User.find({});
        for (const user of users) {
          const book = user.savedBooks.find(book => book.bookId === id);
          if (book) return book;
        }
        return null;
      } catch (error) {
        throw new Error(`Error fetching book: ${(error as Error).message}`);
      }
    },
    // Query to get a single user by ID or username
    user: async (_parent: any, { id, username }: { id?: string; username?: string }) => {
      try {
        const foundUser = await User.findOne({
          $or: [{ _id: id }, { username }],
        });
        if (!foundUser) {
          throw new Error('Cannot find a user with this id or username!');
        }
        return foundUser;
      } catch (error) {
        throw new Error(`Error fetching user: ${(error as Error).message}`);
      }
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
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }
        return updatedUser;
      } catch (error) {
        throw new Error(`Error deleting book: ${(error as Error).message}`);
      }
    },
    // Mutation to create a user, sign a token, and return it
    createUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      try {
        const user = await User.create({ username, email, password });
        if (!user) {
          throw new Error('Something is wrong!');
        }
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (error) {
        throw new Error(`Error creating user: ${(error as Error).message}`);
      }
    },
    // Mutation to login a user, sign a token, and return it
    login: async (_parent: any, { username, email, password }: { username?: string; email?: string; password: string }) => {
      try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
          throw new Error("Can't find this user");
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new Error('Wrong password!');
        }
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (error) {
        throw new Error(`Error logging in: ${(error as Error).message}`);
      }
    },
    // Mutation to save a book to a user's savedBooks
    saveBook: async (_parent: any, { userId, book }: { userId: string; book: BookDocument }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          throw new Error('User not found');
        }
        return updatedUser;
      } catch (error) {
        throw new Error(`Error saving book: ${(error as Error).message}`);
      }
    },
  },
};

export default resolvers;
