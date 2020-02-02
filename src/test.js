import React from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import Amplify from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);
import { API, graphqlOperation } from 'aws-amplify';
const ListUsers = `
    query {
      listUserss {
        items {
          friends
        }
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
export default class Test extends React.Component {
    state = {
        friend: '',
        author: '',
        books: []
    };
    async componentDidMount() {
        try {
            const books = await API.graphql(graphqlOperation(ListUsers));
            console.log('books: ', books);
            this.setState({ books: books.data.listUserss.items });
        } catch (err) {
            console.log('error: ', err);
        }
    }
    onChangeText = (key, val) => {
        this.setState({ [key]: val });
    };
    addBook = async () => {
        if (this.state.friend === '' || this.state.author === '') return;
        const book = { friend: this.state.friend, author: this.state.author };
        try {
            const books = [...this.state.books, book];
            this.setState({ books, friend: '', author: '' });
            console.log('books: ', books);
            await API.graphql(graphqlOperation(AddUser, book));
            console.log('success');
        } catch (err) {
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
                    placeholder="What do you want to read?"
                />
                <TextInput
                    style={styles.input}
                    value={this.state.author}
                    onChangeText={val => this.onChangeText('author', val)}
                    placeholder="Who wrote it?"
                />
                <Button onPress={this.addBook} friend="Add to friends list" color="#eeaa55" />
                {this.state.books.map((book, index) => (
                    <View key={index} style={styles.book}>
                        <Text style={styles.friend}>{book.friends}</Text>
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