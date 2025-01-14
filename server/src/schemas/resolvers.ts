import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import type { BookDocument } from '../models/Book.js';
import type { IResolvers } from '@graphql-tools/utils';
import type { Context } from '../types/context.js';

const resolvers: IResolvers = {
  Query: {
    me: async (_parent, _args, context: Context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    users: async () => {
      try {
        return await User.find({});
      } catch (error) {
        throw new Error(`Error fetching users: ${(error as Error).message}`);
      }
    },
    user: async (_parent, { id }: { id: string }) => {
      try {
        return await User.findById(id).populate('savedBooks');
      } catch (error) {
        throw new Error(`Error fetching user: ${(error as Error).message}`);
      }
    },
  },
  Mutation: {
    addUser: async (_parent, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    login: async (_parent, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent, { bookData }: { bookData: BookDocument }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        ).populate('savedBooks');

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (_parent, { bookId }: { bookId: string }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;
