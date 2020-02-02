import React from "react";
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
    state = {
        subtitle: 'Introduction'
    };

    constructor(props) {
        super(props);
        this.props.subtitle(this.state.subtitle);
    }

    render() {
        return (
            <div>
                <h2>Welcome,</h2>
                <br/>
                <p>this website is my introduction to the ant colony optimization algorithm.</p>
                <p>If you want to see an example first go to the <Link to='/demonstration'>demonstration</Link>.</p>
                <p><b>Navigate through the side menu</b> to check out the different aspects of the algorithm.</p>
                <p>Please note that this website is not optimized for mobile screens, in particular portrait.</p>
                <p>Use <b>landscape mode</b> for the best user experience.</p>
                <br/>
                <p>Have a look at the source code at my <a href="https://github.com/PatrickNestmeyer" target="_blank">Github profile</a> and for other projects.</p>
                <p>If you want to know more about me check my <a href="https://www.linkedin.com/in/patrick-nestmeyer-b3346996/" target="_blank">LinkedIn</a></p>
            </div>
        );
    }
}
