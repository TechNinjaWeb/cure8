/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUsers = `mutation CreateUsers(
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
export const updateUsers = `mutation UpdateUsers(
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
export const deleteUsers = `mutation DeleteUsers(
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
export const addFriend = `mutation AddFriend(
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
export const rejectFriend = `mutation RejectFriend(
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
