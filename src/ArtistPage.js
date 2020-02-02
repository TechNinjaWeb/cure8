import React from 'react';
import axios from 'axios';
//const id = "0TnOYISbd1XYRBk9myaseg";
class Artist extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            name: "M",
            followers: 0,
            popularity: 0
          }

    }
    async componentDidMount(){
        const response =
        await axios.get("https://api.spotify.com/v1/artists/"+this.props.ArtistID,
            { headers: {'Content-Type': 'application/json',
                        'Accept':'application/json',
                        'Authorization': 'Bearer BQB81IRNo8eNwR9nW9buY0LPwcUfmdKNSnxsB3wC36iNNLOkwfiMihUXfhj5FEBve8edhef53BPIjZTbh-3FzQnIXLphg8Qmfx0c7GYkR5jSArnLRZou7Cv0d3eRjH3QLSPlHnF3YMl7L33qLg'
                        }}
        )
        this.setState({
            name : response.data.name,
            followers : response.data.followers.total,
            popularity: response.data.popularity
            });
        console.log(response.data)
    }
    render() {
        return (
            <div>
                <h1><p>Artist Page</p></h1>
                <h2>Name of the artist = {this.state.name}</h2>
                <h3>Followers = {this.state.followers}</h3>
                <h3>Popularity = {this.state.popularity}</h3>
            </div>
        );
    }
}

export default Artist;
