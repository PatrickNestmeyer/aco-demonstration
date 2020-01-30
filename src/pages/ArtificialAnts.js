import React from "react";

export default class ArtificialAnts extends React.Component {

    state = {
        subtitle: 'Artificial Ants'
    };

    constructor(props) {
        super(props);
        this.props.subtitle(this.state.subtitle);
    }

    render() {
        return (
            <h2>Artificial Ants</h2>
        );
    }
}
