import React from 'react';
import './Dropdown.css';
class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            selected: this.props.initial || -1
        };
        this.closeMenu = this.closeMenu.bind(this);
    }

    closeMenu(event) {
        if (!this.dropdownMenu.contains(event.target)) {
            this.setState({ active: false, }, () => {
                document.removeEventListener('click', this.closeMenu);
            });
        }
    }
    toggleDropdown() {
        event.preventDefault();
        this.setState({ active: !this.state.active}, () => {
            document.addEventListener('click', this.closeMenu);
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
                <ul ref={(element) => {
                    this.dropdownMenu = element;
                }} className={"dropdown__list " + (this.state.active ? 'dropdown__list--active' : '')}>{this.renderOptions()}</ul>
            </div>
        );
    }
}


//const options = ['Apple', 'Orange', 'Pear', 'Mango'];

//ReactDOM.render(<Dropdown title="Dropdown Menu" options={options} />, document.getElementById('mount'));
export default Dropdown;