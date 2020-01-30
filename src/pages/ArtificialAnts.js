import React from "react";
import {Tabs} from "antd";
const { TabPane } = Tabs;


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
            <Tabs defaultActiveKey="1">
                <TabPane tab="Components" key="1">
                    <h2>Components of an aco system</h2>
                    <ol>
                        <li><b>Nodes:</b> subproblem to solve</li>
                        <li><b>Edges:</b> pheromones and local heuristics (decision-making)</li>
                        <li><b>Constraints:</b> conditions to a valid solution</li>
                        <li><b>Solution:</b> valid path through the graph</li>
                        <li><b>Cost function:</b> evaluation of the solution</li>
                    </ol>
                </TabPane>
                <TabPane tab="Implementation" key="2">
                    <h2>Implementation of an ant colony system</h2>
                    <ol>
                        <li>Run arbitrary number of iterations</li>
                        <li>Let each ant find its way through graph</li>
                        <li>Update of the pheromone values</li>
                    </ol>
                </TabPane>
            </Tabs>
        );
    }
}
