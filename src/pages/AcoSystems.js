import React from "react";
import {Tabs} from "antd";
import { Table } from 'antd';
import MathJax from "react-mathjax";

const { TabPane } = Tabs;

export default class AcoSystems extends React.Component {

    state = {
        subtitle: 'Ant-Colony-Optimization systems'
    };

    constructor(props) {
        super(props);
        this.props.subtitle(this.state.subtitle);
    }

    render() {
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="Overview" key="1">
                    <h2>Overview of aco algorithms</h2>
                    <Table pagination={false} dataSource={dataSource} columns={columns} />
                </TabPane>
                <TabPane tab="Ant-System" key="2">
                    <h2>Ant-System (AS)</h2>
                    <p>Concentration of pheromones between two nodes i and j:</p>
                    <br/>
                        <MathJax.Provider>
                            <div>
                                <MathJax.Node formula={formulas.pheromoneConcentrationAS} />
                            </div>
                        </MathJax.Provider>
                    <br/>
                    <p>With the following characteristics:</p>
                    <ul>
                        <li>AR = cooling rate</li>
                        <li>AP = Influence of the ant on the concentration of pheromones</li>
                    </ul>
                    <br/>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={formulas.influenceAntsAS} />
                        </div>
                    </MathJax.Provider>
                    <br/>
                    <p>With p = Constant between 0 and 1</p>
                    <p>For every ant used the path:</p>
                    <br/>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={formulas.pathCalculation} />
                        </div>
                    </MathJax.Provider>
                    <br/>
                    <p>With D = heuristic information</p>
                    <p>So the probability on node i for the edge i,j is:</p>
                    <br/>
                    <MathJax.Provider>
                        <div>
                            <MathJax.Node formula={formulas.probabilityAS} />
                        </div>
                    </MathJax.Provider>
                    <br/>
                    <p>With the following characteristics:</p>
                    <ul>
                        <li>PK = concentration of pheromones</li>
                        <li>D = heuristic Information</li>
                        <li>k = other possible nodes</li>
                    </ul>
                    <p>Finally update of pheromones after each ant and each iteration.</p>
                </TabPane>
            </Tabs>
        );
    }
}

const formulas = {
    pheromoneConcentrationAS: `\\tau ij=AR+AP`,
    influenceAntsAS: `AR=(1-p)*\\tau ij`,
    pathCalculation: `AP = AP + D`,
    probabilityAS: `Pij=\\frac{PKij*Dij}{\\sum_{k} PKik*Dik}`
}

const dataSource = [
    {
        key: '1',
        name: 'Ant System',
        author: 'Dorigo',
        year: '1991',
    },
    {
        key: '2',
        name: 'Elitist AS',
        author: 'Dorigo',
        year: '1992',
    },
    {
        key: '3',
        name: 'Ant-Q',
        author: 'Gambardelle & Dorigo',
        year: '1995',
    },
    {
        key: '4',
        name: 'Ant-Colony System',
        author: 'Dorigo & Gambardella',
        year: '1996',
    },
    {
        key: '5',
        name: 'Max-Min AS',
        author: 'Stützle & Hoos',
        year: '1996',
    },
    {
        key: '6',
        name: 'Ranked-Based AS',
        author: 'Bullnheimer',
        year: '1997',
    },
    {
        key: '7',
        name: 'Ants',
        author: 'Maniezzo',
        year: '1999',
    },
    {
        key: '8',
        name: 'BWAS',
        author: 'Cordon',
        year: '2000',
    },
    {
        key: '9',
        name: 'Hyper-Cube AS',
        author: 'Blum',
        year: '2001',
    }
];

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
    },
    {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
    },
];
