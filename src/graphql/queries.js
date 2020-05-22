/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUsers = /* GraphQL */ `
  query GetUsers($id: ID!) {
    getUsers(id: $id) {
      id
      email
      friends
      friendRequests
    }
  }
`;
export const listUserss = /* GraphQL */ `
  query ListUserss(
    $filter: ModelUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        friends
        friendRequests
      }
      nextToken
    }
  }
`;
export const getUsersByEmail = /* GraphQL */ `
  query GetUsersByEmail($email: String!) {
    getUsersByEmail(email: $email) {
      id
      email
      friends
      friendRequests
    }
  }
`;
export const getArtist = /* GraphQL */ `
  query GetArtist($Name: String!) {
    getArtist(Name: $Name) {
      Name
      spotifyID
      curPrice
      Popularity
      Price
      Dates
      LastDateUpdated
    }
  }
`;
