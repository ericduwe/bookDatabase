const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id})
            } 
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        loginUser: async (parent, {email, password}) => {
            const user = await User.findOne({email: email});
            if (!user) {
              throw new AuthenticationError("Can't find this user");
            }
        
            const correctPw = await user.isCorrectPassword(password);
        
            if (!correctPw) {
              throw new AuthenticationError('Wrong password!')
            }
            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return { token, user };
        } ,

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                );
                return updatedUser
            }
            throw new AuthenticationError('Log in to save a book!')
        },
    

        removeBook: async (parent, {bookId}, context) => {
            if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: {bookId} } },
                { new: true }
              );
              return updatedUser;
            }
                throw new AuthenticationError("Log in to remove books");
              
              
            }
        }

    }


module.exports = resolvers