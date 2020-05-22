import React from 'react';
import axios from 'axios';
import {Image, View} from "react-native";
import {Button, Text} from "react-native-elements";
//import Icon from "react-native-vector-icons/Icon";
//const id = "0TnOYISbd1XYRBk9myaseg";
import XMLParser from 'react-xml-parser';
import {API, graphqlOperation} from "aws-amplify";
const ArtistLastDate = `
     query GetArtist($Name: String!) {
       getArtist(Name: $Name) {
         LastDateUpdated
  }
}
    `;
const CreateArtist = `
    mutation ($Name: String!, $spotifyID: ID!, $curPrice: Int!, $Popularity: Int!, $Price: Int!, $Dates: String!, $LastDateUpdated: String!){

     createArtist(input: {
        Name: $Name,
        spotifyID: $spotifyID,
        curPrice: $curPrice,
        Popularity: $Popularity,
        Price: $Price,
        Dates: $Dates,
        LastDateUpdated: $LastDateUpdated
     }) {
        Name
     }
    }
    `;
const UpdateArtist = `
    mutation ($Name: String!, $spotifyID: ID!, $curPrice: Int!, $Popularity: Int!, $Price: Int!, $Dates: String!, $LastDateUpdated: String!){

     updateArtist(input: {
        Name: $Name,
        spotifyID: $spotifyID,
        curPrice: $curPrice,
        Popularity: $Popularity,
        Price: $Price,
        Dates: $Dates,
        LastDateUpdated: $LastDateUpdated
     }) {
        Name
     }
    }
    `;
class Artist extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            name: "M",
            followers: 0,
            popularity: 0,
            artistDescription: []
          }

    }
    decode(input) {
        var txt = document.createElement("textarea");
        txt.innerHTML = input;
        return txt.value;
    }

     trimSentence(string){
        var found = false;
        var index = null;

        var characterGroups = string.split(' ').reverse();

        var position     = 1,//skip the first one since we know that's the end anyway
            elements     = characterGroups.length,
            element      = null,
            prevHadUpper = false,
            last         = null,
            lookFor      = '';

        while(!found && position < elements) {
            element = characterGroups[position].split('');

            if(element.length > 0) {
                last = element[element.length-1];

                // test last character rule
                if(
                    last=='.' ||                // ends in '.'
                    last=='!' ||                // ends in '!'
                    last=='?' ||                // ends in '?'
                    (last=='"' && prevHadUpper) // ends in '"' and previous started [A-Z]
                ) {
                    found = true;
                    index = position-1;
                    lookFor = last+' '+characterGroups[position-1];
                } else {
                    if(element[0] == element[0].toUpperCase()) {
                        prevHadUpper = true;
                    } else {
                        prevHadUpper = false;
                    }
                }
            } else {
                prevHadUpper = false;
            }
            position++;
        }


        var trimPosition = string.lastIndexOf(lookFor)+1;
        return string.substr(0,trimPosition);
    }
    async componentDidMount() {
        const response =
            await axios.get("https://api.spotify.com/v1/artists/" + this.props.ArtistID,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': "Bearer " + this.props.bearer.data.access_token
                    }
                }
            )
        // const artistDescription =
        //     await axios.get("https://api.genius.com/artists/16775",
        //         { headers: {'Content-Type': 'application/json',
        //                 'Accept':'application/json',
        //                 'Authorization': "Bearer Pc6xVeaU5I6Dk58OFFPFWbjXQcyRExI85wgKrLEBHcQLj_9r39nowXtcO4fxi1sR",
        //                 "Access-Control-Allow-Origin": "*"
        //             }}
        //     )
        const artistDescription =
            await axios.get("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + response.data.name + "&api_key=e9f3eadd91b4a99a0656318960d9d4f5",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }
            )

        // var XMLParser = require('react-xml-parser');
        //console.log(artistDescription.data);
        var jsonDataFromXml = new XMLParser().parseFromString(artistDescription.data);
        console.log(jsonDataFromXml);
        var parseString = this.trimSentence(this.decode(jsonDataFromXml.children[0].children[jsonDataFromXml.children[0].children.length - 1].children[2].value))
        //  var parseString = require('xml2js').parseString;
        //  parseString(artistDescription, function (err, result) {
        //     console.dir(result);
        // });
        console.log(parseString);
        var moment = require('moment-timezone');
        var dateEST =moment().tz("America/New_York").format().substring(0,10);
        try {
            const params = {Name: response.data.name};
            const date = await API.graphql(graphqlOperation(ArtistLastDate, params));
            console.log("Last day updated: " + date.data.getArtist.LastDateUpdated);
            if(date.data.getArtist.LastDateUpdated != dateEST){
                const params2 = {Name: response.data.name,
                    spotifyID: this.props.ArtistID,
                    curPrice: response.data.popularity*100,
                    Popularity: response.data.popularity,
                    Price: response.data.popularity*100,
                    Dates: dateEST,
                    LastDateUpdated: dateEST};
                console.log(await API.graphql(graphqlOperation(UpdateArtist, params2)));
            }

        }catch (err) {
            const params = {Name: response.data.name,
                spotifyID: this.props.ArtistID,
                curPrice: response.data.popularity*100,
                Popularity: response.data.popularity,
                Price: response.data.popularity*100,
                Dates: dateEST,
                LastDateUpdated: dateEST};
            console.log(await API.graphql(graphqlOperation(CreateArtist, params)));
        }
        this.setState({
            name : response.data.name,
            followers : response.data.followers.total,
            popularity: response.data.popularity,
            artistDescription: parseString//.response.artist.description.dom.children
            });
      /*  let homeArray = new Array(artistDescription.length);
        let i = 0

        for (var key in homeArray) {
            homeArray[i] =  this.state.artistDescription[key];
            i = i + 1;
        }
        this.state.artistDescription = homeArray
        console.log(response.data)*/
        console.log(this.state.artistDescription)
    }
    render() {
        return (
            <div>
                <h1><p>Artist Page</p></h1>
                <h2>Name of the artist = {this.state.name}</h2>
                <h3>Followers = {this.state.followers}</h3>
                <h3>Popularity = {this.state.popularity}</h3>
                <h3>artistDescription = {this.state.artistDescription}</h3>
            </div>
        );
    }
}

export default Artist;
