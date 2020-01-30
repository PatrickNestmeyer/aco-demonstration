import React from "react";

export default class BiologicalBackground extends React.Component {

    state = {
        subtitle: 'Biological Background'
    };

    constructor(props) {
        super(props);
        this.props.subtitle(this.state.subtitle);
    }

    render() {
        return (
            <h2>Biological Background</h2>
        );
    }
}
