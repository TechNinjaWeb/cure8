// App.js
import React from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);
import { Auth } from "aws-amplify";
import { API, graphqlOperation } from 'aws-amplify';
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
const poolData = {UserPoolId: "us-east-2_pgBKXdJOH", ClientId: "50i0qg409uni58jng27v826sfh"};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


const ListUsers = `
     query GetUsers($id: ID!) {
       getUsers(id: $id) {
         friends
  }
}
    `;

const FindUserByEmail = `
     query GetUsers($email: String!) {
       getUsersByEmail(email: $email) {
         id
  }
}
    `;

const RequestFriend3 = `
    mutation ($email: String!, $receiverEmail: String!){

     updateUsers(input: {
        email: $email,
        receiverEmail: $receiverEmail
     }) {
        friendRequests
     }
    }
    `;
const RequestFriend2 = `
    mutation ($friendRequests: String!, $id: ID!){

     updateUsers(input: {
        friendRequests: $friendRequests,
        id: $id
     }) {
        friendRequests
     }
    }
    `;
const AddUser = `
    mutation ($friend: String! $author: String) {
      createUsers(input: {
        friend: $friend
        author: $author
      }) {
        friend author
      }
    }
    `;

export default class Friends extends React.Component {
    state = {
        friend: '',
        author: '',
        books: [],
        idOfFriend:''
    };
    async componentDidMount() {

                const params = { id: this.props.id };
                const books = await API.graphql(graphqlOperation(ListUsers,params));
                console.log('books: ', books);
                this.setState({ books: Array.from(books.data.getUsers.friends)});
                console.log(this.state.books);



    }
    onChangeText = (key, val) => {
        this.setState({ [key]: val });
    };
    addBook = async () => {
        if (this.state.friend === '') return;
        const book = { friend: this.state.friend };

        try {
            const params = {email: this.state.friend}
             this.state.idOfFriend = await API.graphql(graphqlOperation(FindUserByEmail,params));
            console.log(this.state.idOfFriend);

            try {
                /*const books = [...this.state.friend, book];
                this.setState({ books, friend: '', author: '' });
                console.log('books: ', books);*/
                const params = {friendRequests: this.props.id, id: this.state.idOfFriend};
               // const params = {email: this.props.email, receiverEmail: this.state.friend};
                await API.graphql(graphqlOperation(RequestFriend2, params));
                console.log('success');
            } catch (err) {
                console.log('error: ', err);
            }
        }catch (err) {
            console.log('error: ', err);
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={this.state.friend}
                    onChangeText={val => this.onChangeText('friend', val)}
                    placeholder="Add a friend"
                />
                <Button onPress={this.addBook} friend="Add to friends list" color="#eeaa55" />
                {this.state.books.map((book, index) => (
                    <View key={index} style={styles.book}>
                        <Text style={styles.friend}>{book}</Text>
                    </View>
                ))}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 50
    },
    input: {
        height: 50,
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
        marginVertical: 10
    },
    book: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10
    },
    friend: { fontSize: 16 },
    author: { color: 'rgba(0, 0, 0, .5)' }
});