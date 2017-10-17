import React, { Component } from 'react'
import SegmentContainer from './SegmentContainer'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'


export default class Main extends Component {
    render() {
        return (
            <div>
    			<SegmentContainer />
    		</div>
        )
    }
}