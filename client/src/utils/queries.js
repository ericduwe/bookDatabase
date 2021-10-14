import gql from 'graphql-tag';

export const QUERY_ME = gql`
query me {
    me {
    _id
    username
    email
    savedBooks
    }
}`