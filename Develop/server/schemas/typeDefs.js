const { gql } = require('apollo-server-express');


const typeDefs = gql`

    type User {
        _id: ID,
        username: String,
        email: String,
        bookCount: Int,
        savedBooks: [Book]
    }

    type Book {
        bookId: ID,
        authors: [String],
        description: String,
        bookId: String,
        image: String,
        link: String,
        title: String
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String], description: String, bookId: String, image: String, link: String, title: String): User
        removeBook(bookId: ID): User
    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInput {
        authors: [String]
        description: String
        bookId: ID
        image: String
        link: String
        title: String
    }
    

`;


module.exports = typeDefs;