import React, { Component } from 'react'
import { Menu, Modal, Button, Form, Table, Label, Icon } from 'semantic-ui-react'
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom'
import SegmentContainer from './containers/SegmentContainer'
import MailContainer from './containers/Mail'
import { initState, deleteState, addState, editState } from './reducers/reducer'
const axios = require('axios')

class AppRoot extends Component {



    state = {
        activeItem: 'Home',
    }

    render() {

        const {activeItem} = this.state

        return (
            <div>
            <Menu fixed='top' size='large' inverted>
                <Menu.Item name='Server Monitoring' header />
                <Menu.Item as={Link} to='/' name='Home' active={activeItem === 'Home'} onClick={() => this.handleItemClick} />
                <Menu.Item as={Link} to='/list' name='List' active={activeItem === 'List'} onClick={() => this.handleItemClick} />
            </Menu>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/list' component={List} />
            </Switch>
            </div>
        )
    }
}


const Home = () => (
    <div>
        <SegmentContainer />
    </div>
)

const List = () => (
    <div>
        <MailContainer />
    </div>
)

export default AppRoot