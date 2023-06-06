const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { add } = require('../models/Book');


const resolvers = {

    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id })

                    // .select('-__v -password')
                    // .populate('books')

                // return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
             },

             saveBook: async (parent, { bookData }, context) => {
                if (context.user) {
                  return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: {...bookData}} },
                    { new: true }
                  );
                }
                throw new AuthenticationError('You need to be logged in!');
              },
              removeBook: async (parent, { bookId }, context) => {
                if (context.user) {
                  return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {bookId} } },
                    { new: true },
                  );
                }
                throw new AuthenticationError('You need to be logged in!');
              },

            },
}


module.exports = resolvers;