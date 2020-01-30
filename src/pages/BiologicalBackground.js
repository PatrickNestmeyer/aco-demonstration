import React from "react";
import { Tabs } from 'antd';
import MathJax from 'react-mathjax';
const { TabPane } = Tabs;

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
            <Tabs defaultActiveKey="1">
                <TabPane tab="Stigmergy" key="1">
                    <h2>Stigmergy</h2>
                    <ul>
                        <li>Investigation of termites by Pierre-Paul Grassè (1895-1985)</li>
                        <li>Indirect, non symbolical, decentralized form of communication</li>
                        <li>Communication by manipulating the environment</li>
                        <li>Informations are locally limited</li>
                    </ul>
                    <h2>Stigmergy in ant colonies</h2>
                    <ul>
                        <li>Ants spray pheromones</li>
                        <li>Choice of path is influenced by concentration of pheromones nearby</li>
                        <li>Pheromones are heavily concentrated on short paths</li>
                    </ul>
                </TabPane>
                <TabPane tab="Bridge experiment - I" key="2">
                    <h2>Bridge experiment</h2>
                    <ul>
                        <li>Two paths of <b>equal</b> length between anthill and feeding station</li>
                        <li>Ants choose a path randomly in the beginning</li>
                        <li>Decision for a specific path more and more often, due to its stronger concentrated pheromones over time</li>
                        <li>After a while only one path is used</li>
                    </ul>
                    <h2>Bridge experiment</h2>
                    <ul>
                        <li>Two paths of <b>different</b> length between anthill and feeding station</li>
                        <li>Shortest path is chosen quickly</li>
                        <li>Faster compression of pheromones</li>
                    </ul>
                </TabPane>
                <TabPane tab="Mathematical interpretation" key="3">
                    <h2>Mathematical interpretation</h2>
                    <p>a = total number of ants chosen path a</p>
                    <p>b = total number of ants chosen path b</p>
                    <p>Pa = probability for an ant to choose path a</p>
                    <br/>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={formulas.probability} />
                        </div>
                    </MathJax.Provider>
                    <br/>
                    <h2>Further mathematical interpretation</h2>
                    <p>h = non-linearity of decision function</p>
                    <p>k = attractiveness of a pheromone free path</p>
                    <br/>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={formulas.montecarloProbability} />
                        </div>
                    </MathJax.Provider>
                    <br/>
                    <p>Monte-Carlo simulation confirms nearly perfect behavior of ants for:</p>
                    <ul>
                        <li>h=2</li>
                        <li>k=20</li>
                    </ul>
                </TabPane>
            </Tabs>
        );
    }
}

const formulas = {
    pheromoneConcentrationAS: `Pa=\\frac{a}{a+b}=1-Pb`,
    montecarloProbability: `Pa=\\frac{(a+k)^h}{(a+k)^h+(b+k)^h}`,
}
