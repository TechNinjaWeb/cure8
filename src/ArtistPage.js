import React from 'react';
import axios from 'axios';
import {Image, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import {Button, Text} from "react-native-elements";
//const id = "0TnOYISbd1XYRBk9myaseg";
import XMLParser from 'react-xml-parser';
import {API, graphqlOperation} from "aws-amplify";
import { Dimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
const d = Dimensions.get("window");
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {LinearGradient} from "expo-linear-gradient";
const ArtistLastDate = `
     query GetArtist($Name: String!) {
       getArtist(Name: $Name) {
         LastDateUpdated,
         Price,
         Dates
         
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
        Name,
        Price,
        Dates
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
            artistDescription: [],
            price: [],
            dates: [],
            imageLink: "",
            genres: [],
            graphData: [],
            showPriceGraph: true,
            today: "",
            sign: "",
            theDif: 0,
            tracksData: []
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
     millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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
        var toptracksData =
            await axios.get("https://api.spotify.com/v1/artists/" + this.props.ArtistID+"/top-tracks",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': "Bearer " + this.props.bearer.data.access_token
                    },
                    params: {
                        'market': "US"
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
        this.setState({today:moment().tz("America/New_York").format('LL')})
        const params = {Name: response.data.name};
        const date = await API.graphql(graphqlOperation(ArtistLastDate, params));
        console.log(date.data.getArtist);
        var curPrice = [response.data.popularity*100];
        if(date.data.getArtist == null){
            console.log("Check 3");
            const params = {Name: response.data.name,
                spotifyID: this.props.ArtistID,
                curPrice: response.data.popularity*100,
                Popularity: response.data.popularity,
                Price: response.data.popularity*100,
                Dates: dateEST,
                LastDateUpdated: dateEST};
            this.setState({ showPriceGraph: false });
            console.log(await API.graphql(graphqlOperation(CreateArtist, params)));
            this.setState({price: curPrice, dates: dateEST});
        }else {
            if (date.data.getArtist.LastDateUpdated != dateEST) {
                const params2 = {
                    Name: response.data.name,
                    spotifyID: this.props.ArtistID,
                    curPrice: response.data.popularity * 100,
                    Popularity: response.data.popularity,
                    Price: response.data.popularity * 100,
                    Dates: dateEST,
                    LastDateUpdated: dateEST
                };
                const updated = await API.graphql(graphqlOperation(UpdateArtist, params2));
                console.log("Check 1.5");
                this.setState({price: updated.data.updateArtist.Price, dates: updated.data.updateArtist.Dates});
            } else {
                console.log("Check 2");
                if (date.data.getArtist.Dates.length == 1) {
                    this.setState({showPriceGraph: false});
                    this.setState({price: date.data.getArtist.Price});
                } else {
                    this.setState({price: date.data.getArtist.Price, dates: date.data.getArtist.Dates});
                }
            }
        }

        const data = [];
         /*   {
                name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
            },
            {
                name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
            },
          */
        console.log("-----");
        console.log(this.state.dates);
        console.log(this.state.price);
        console.log("-----");
        var dateEST2 =moment().tz("America/New_York").format().substring(0,10);
        var today = moment(dateEST2);
        const sevenDays = [];
        sevenDays[6] = dateEST2;
        var index = 1;
        for(var k = 5; k>=0; k--) {
            var temp = today.subtract(index, 'days').format().substring(0,10);
            console.log(temp);
            sevenDays[k]=temp;
        }
        console.log(sevenDays);
        var exist = 0;
        var firstNonnullValueCheck = 0;
        if(this.state.price.length>7){
            for (var j = 0; j < sevenDays.length; j++) {
                exist = 0;
                for (var i = this.state.price.length-7; i < this.state.price.length; i++) {

                    if(sevenDays[j]===this.state.dates[i]){
                        var day = moment(this.state.dates[i]);
                        data.push({name: day.format("MM/DD"), price: this.state.price[i]});
                        exist =1;
                        firstNonnullValueCheck = 1;
                    }
                }
                if(exist === 0 && firstNonnullValueCheck=== 1){
                    var day = moment(sevenDays[j]);
                    data.push({name: day.format("MM/DD")});
                }

            }
        }else {
            for (var j = 0; j < sevenDays.length; j++) {
                exist = 0;
                for (var i = 0; i < this.state.price.length; i++) {
                    if(sevenDays[j]===this.state.dates[i]){
                        var day = moment(this.state.dates[i]);
                        data.push({name: day.format("MM/DD"), price: this.state.price[i]});
                        exist =1;
                        firstNonnullValueCheck = 1;
                    }
                }
                if(exist === 0 && firstNonnullValueCheck=== 1){
                    var day = moment(sevenDays[j]);
                    data.push({name: day.format("MM/DD")});
                }
            }
        }

        console.log(data);
        var len = this.state.price.length;
        if(this.state.price[len-1]<this.state.price[len-2]){
            this.setState({sign: "-"});
        }else{
            this.setState({sign: "+"});
        }
        var genres = [];
        for(var h = 0; h<response.data.genres.length; h++){
            if(h === 3){
                break;
            }
            genres.push(response.data.genres[h]);
        }

        var tracksTrimmed;
        if(toptracksData.data.tracks.length>5){
            tracksTrimmed = toptracksData.data.tracks.slice(0,5);
        }else {
            tracksTrimmed = toptracksData.data.tracks;
        }

        console.log(tracksTrimmed);

        console.log(response.data.genres);
        this.setState({theDif: Math.abs(this.state.price[len-1]-this.state.price[len-2])});
        this.setState({
            name : response.data.name,
            followers : response.data.followers.total,
            popularity: response.data.popularity,
            artistDescription: parseString,//.response.artist.description.dom.children
            imageLink:response.data.images[response.data.images.length-2].url,
            genres: genres,
            graphData: data,
            tracksData: tracksTrimmed
            });
        console.log("THIS IS IMAGE LINK "+this.state.imageLink)
      /*  {this.state.tracksData.data.tracks.map((songName) => (
                        <View style={{marginLeft: 15, backgroundColor: "rgba(227, 106,43, 1)", marginBottom: 10}}>
                            <View style={{backgroundColor: "rgba(15, 51,81, 1)", width: '100%', height: '0.15%', marginTop: 15}}></View>
                            <Text style={{
                                color:'#fff', fontSize:16, fontFamily:"Lucida Grande", padding: 5}}>{songName.name}
                            </Text>
                        </View>
                    ))}
       */
        console.log(this.state.artistDescription);
    }
    renderColorfulLegendText(value, entry) {
        const color  = "#FFF";
        return <span style={{ color }}>{value}</span>;
    }
    render() {
        return (
            <View style={styles.background}>
                <View style={{flexDirection: 'row',width: '100%',
                    height: '100%',}}>
                <View style={styles.leftContainer}>
                    <View style={{ marginTop: 70, flexDirection: 'column'}}>
                        <View style={{ marginLeft: 75,
                            marginRight: 75, alignItems: 'center',
                            justifyContent: 'center',}}>
                        <Image source={{uri: this.state.imageLink}} style={styles.artistPic}/>
                        </View>
                        <Text style={{
                            color:'#fff', fontSize:22, marginLeft: 37.5,
                            marginRight: 37.5, marginTop: 20,fontFamily:"Lucida Grande", textAlign: "center"}}>{this.state.name}
                        </Text>
                        <Text style={{
                            color:'#fff', fontSize:15, marginLeft: 50,
                            marginRight: 50, marginTop: 10,fontFamily:"Lucida Grande"}}>{this.state.artistDescription}
                        </Text>
                    <View style={{ marginLeft: 50, marginRight: 50, marginTop: 25, flexDirection: 'row', flexWrap: 'wrap'}}>
                        <Text style={{
                            color:'#fff', fontSize:18,fontFamily:"Lucida Grande"}}>Genres:
                        </Text>
                        {this.state.genres.map((genre) => (
                            <View style={{marginLeft: 15, backgroundColor: "rgba(227, 106,43, 1)", marginBottom: 10}}>
                                <Text style={{
                                    color:'#fff', fontSize:16, fontFamily:"Lucida Grande", padding: 5}}>{genre}
                                </Text>
                            </View>
                        ))}
                    </View>
                        {this.state.showPriceGraph === true &&(
                        <View style={{paddingTop: 50}}>
                            <LineChart
                                width={0.9*d.width*0.271}
                                height={0.2 * d.height}
                                data={this.state.graphData}
                                margin={{
                                    top: 10, right: 30, left: 30, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="white"/>
                                <XAxis dataKey="name" stroke="white"/>
                                <YAxis stroke="white"  unit='$'/>
                                <Tooltip />
                                <Legend payload={[
                                    { value: 'Price of contract with '+ this.state.name, type: 'line', color: 'rgba(227, 106,43, 1' }
                                ]} formatter={this.renderColorfulLegendText}/>
                                <Line connectNulls type="monotone" dataKey="price" stroke="rgba(227, 106,43, 1)" fill="rgba(227, 106,43, 1)" activeDot={{ r: 8 }} />
                            </LineChart>
                        </View>
                        )}
                        {this.state.showPriceGraph === false &&(
                            <View style={{paddingTop: 50}}>
                                <Text>NO DATA AVAILABLE</Text>
                            </View>
                        )}
                        <Text style={{
                            color:'#fff', fontSize:15, fontFamily:"Lucida Grande", marginTop: 10, textAlign: "left", marginLeft: 50,
                            marginRight: 50}}>{this.state.today}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                        <Text style={{
                            color:'#fff',fontWeight: "bold", fontSize:40, fontFamily:"Lucida Grande", marginTop: 5, textAlign: "left", marginLeft: 50}}>{"$"+this.state.price[this.state.price.length-1]}
                        </Text>
                        <Text style={{
                            color:'#fff',fontWeight: "bold", fontSize:20, fontFamily:"Lucida Grande", marginTop: 5, textAlign: "left",
                            marginRight: 50}}>{this.state.sign+"$"+this.state.theDif}
                        </Text>
                        </View>
                        <TouchableOpacity style={{borderRadius: 100,marginTop: 30, height:'9%',backgroundColor: 'rgba(227, 106,43, 1)',marginLeft: 50,
                            marginRight: 50,justifyContent: 'center',
                            alignItems: 'center'}}>
                                    <Text style={{fontSize: 30,
                                        fontWeight: 'bold',
                                        color: 'rgba(15, 51,81, 1)'}}>BUY NOW</Text>

                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.middleContainer}>
                    <Text style={{
                        color:'rgba(227, 106,43, 1)',fontWeight: "bold", fontSize:22, fontFamily:"Lucida Grande", marginTop: 5, textAlign: "left"
                    }}>{this.state.name+ " Top Tracks on Spotify"}
                    </Text>
                    {this.state.tracksData.map((song) => (
                        <View>
                            <View style={{backgroundColor: "rgba(23, 51,79, 1)", width: '80%', height: '0.4%', marginTop: 15, marginBottom: 15}}></View>
                            <View style={{flexDirection:"row", marginLeft: 5}}>
                                <Image source={{uri: song.album.images[1].url}} style={styles.trackPic}/>
                                    <View style={{flexDirection:"column", marginLeft: 20, marginTop: 8, width: "59%"}}>
                                        <Text style={{
                                            color:'#fff', fontSize:16, fontWeight: "bold",fontFamily:"Lucida Grande", paddingBottom: 8}}>{song.name}
                                        </Text>
                                        <View style={{flexDirection:"row"}}>
                                            {song.artists.map((artist, index) => (
                                                <Text style={{
                                                    color:'rgba(193, 193, 193, 1)', fontSize:16, fontFamily:"Lucida Grande"}}>
                                                    <span  key={`demo_snap_${index}`}>{(index ? ', ' : '') + artist.name}</span>
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={{
                                        color:'#fff',opacity:0.6, fontSize:16, fontFamily:"Lucida Grande", marginTop: 20}}>{this.millisToMinutesAndSeconds(song.duration_ms)}
                                    </Text>
                                    <Button  icon={<Icon name="external-link" color="rgba(23, 51,79, 1)" size={20} />} buttonStyle={{
                                        alignSelf: 'flex-end',
                                        width: 20,
                                        height: 20,
                                        backgroundColor: "none",
                                        marginLeft: 30,
                                        marginTop: 20
                                    }}/>
                            </View>
                        </View>
                    ))}
                </View>
                    <View style={styles.rightContainer}>

                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    background: {
        backgroundColor: "rgba(41, 91,131, 1)",
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
        width: '100%',
        height: '100%',
        margin: 0,
        alignItems: 'right',
        justifyContent: 'center',
        minWidth: 1000,
        minHeight: 1000
    },
    leftContainer: {
        width: d.width*0.271,
        height: '100%',
        maxWidth: '100%',
        backgroundColor: "rgba(15, 51,81, 1)",
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomRightRadius: 60,
        borderTopRightRadius: 60
    },
    artistPic: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "rgba(13, 39,58, 1)"
    },
    middleContainer: {
        width: d.width*0.480,
        height: '100%',
        maxWidth: '100%',
        flexDirection: 'column',
        marginLeft: 75,
        marginTop: 60
    },
    rightContainer: {
        width: d.width*0.249,
        height: '60%',
        backgroundColor: "rgba(15, 51,81, 1)",
        alignItems: 'center',
        borderBottomRightRadius: 60,
        borderTopRightRadius: 60,
        borderTopLeftRadius: 60,
        borderBottomLeftRadius: 60,
        marginTop: 20,
        flex: -1
    },
    trackPic:{
        width: 60,
        height: 60
    }

})
export default Artist;
