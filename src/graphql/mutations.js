/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUsers = /* GraphQL */ `
  mutation CreateUsers(
    $input: CreateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    createUsers(input: $input, condition: $condition) {
      id
      email
      friends
      friendRequests
    }
  }
`;
export const updateUsers = /* GraphQL */ `
  mutation UpdateUsers(
    $input: UpdateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    updateUsers(input: $input, condition: $condition) {
      id
      email
      friends
      friendRequests
    }
  }
`;
export const deleteUsers = /* GraphQL */ `
  mutation DeleteUsers(
    $input: DeleteUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    deleteUsers(input: $input, condition: $condition) {
      id
      email
      friends
      friendRequests
    }
  }
`;
export const addFriend = /* GraphQL */ `
  mutation AddFriend(
    $input: AddFriendInput!
    $condition: ModelUsersConditionInput
  ) {
    addFriend(input: $input, condition: $condition) {
      id
      email
      friends
      friendRequests
    }
  }
`;
export const rejectFriend = /* GraphQL */ `
  mutation RejectFriend(
    $input: RejectFriendInput!
    $condition: ModelUsersConditionInput
  ) {
    rejectFriend(input: $input, condition: $condition) {
      id
      email
      friends
      friendRequests
    }
  }
`;
export const createLeague = /* GraphQL */ `
  mutation CreateLeague(
    $input: CreateLeagueInput!
    $condition: ModelLeaguesConditionInput
  ) {
    createLeague(input: $input, condition: $condition) {
      leagueID
      ownerID
      members
    }
  }
`;
export const createArtist = /* GraphQL */ `
  mutation CreateArtist($input: CreateArtistsInput!) {
    createArtist(input: $input) {
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
export const updateArtist = /* GraphQL */ `
  mutation UpdateArtist($input: CreateArtistsInput!) {
    updateArtist(input: $input) {
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
