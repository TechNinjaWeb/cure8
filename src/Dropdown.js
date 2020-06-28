import Artist from "./ArtistPage";
import React from 'react';
import {Image, ImageBackground, Platform, StyleSheet, View} from 'react-native';
import './Dropdown.css';
class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            selected: this.props.initial || -1
        };
    }

    toggleDropdown() {
        this.setState({
            active: !this.state.active
        });
    }

    handleClick(i) {
        this.setState({
            selected: i
        });
    }

    renderOptions() {
        if (!this.props.options) {
            return;
        }

        return this.props.options.map((option, i) => {
            return (
                <li
                    onClick={evt => this.handleClick(i)}
                    key={i}
                    className={"dropdown__list-item " + (i === this.state.selected ? 'dropdown__list-item--active' : '')}
                >
                    {option}
                </li>
            );
        });
    }

    render() {
        return (
            <div className="dropdown">
                <div
                    onClick={() => this.toggleDropdown()}
                    className="dropdown__toggle dropdown__list-item"
                >
                    {this.props.title}
                    <i class="fa fa-angle-down" aria-hidden="true"></i>
                </div>
                <ul className={"dropdown__list " + (this.state.active ? 'dropdown__list--active' : '')}>{this.renderOptions()}</ul>
            </div>
        );
    }
}

const styles = StyleSheet.create({
    "#mount": { margin: "100px" },
    dropdown: {
        position: "relative",
        background: "#fafafa",
        border: "1px solid #eee",
        borderRadius: "1px",
        maxWidth: "300px"
    },
    ".dropdown__arrow": {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: "-20px",
        width: "0",
        height: "0",
        borderLeft: "20px solid transparent",
        borderRight: "20px solid transparent",
        borderBottom: "20px solid #eee",
        borderRadius: "3px"
    },
    ".dropdown__list": {
        transition: "max-height 0.6s ease-out",
        maxHeight: "0",
        overflow: "hidden",
        margin: "0",
        padding: "0"
    },
    ".dropdown__list--active": { maxHeight: "1000px", opacity: "1" },
    ".dropdown__list-item": {
        borderBottom: "1px solid #eee",
        cursor: "pointer",
        listStyle: "none",
        padding: "15px"
    },
    ".dropdown__list-item--active": { background: "#f4f4f4" },
    ".dropdown__list-item:hover": { background: "#f4f4f4" },
    ".dropdown__toggle": { background: "#fff" },
    ".dropdown__toggle:hover": { background: "#fff" }
});
//const options = ['Apple', 'Orange', 'Pear', 'Mango'];

//ReactDOM.render(<Dropdown title="Dropdown Menu" options={options} />, document.getElementById('mount'));
export default Dropdown;