import React from "react";

export default class AcoSystems extends React.Component {

    state = {
        subtitle: 'Demonstration'
    };

    constructor(props) {
        super(props);
        this.props.subtitle(this.state.subtitle);
    }

    render() {
        return (
            <h2>ACO systems</h2>
        );
    }
}
