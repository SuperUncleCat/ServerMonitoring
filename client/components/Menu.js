import React, { Component } from 'react'
import { Container, Divider, Header, Menu, Segment } from 'semantic-ui-react'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import SegmentContainer from '../containers/SegmentContainer'
import EmailContainer from '../containers/Email'

export default class MenuComponent extends Component {

    state = {
        activeItem: 'home'
    }

    handleItemClick = (e, {name}) => this.setState({
        activeItem: name
    })

    render() {

        const {activeItem} = this.state

        return (
            <BrowserRouter>
            <div>
            <Menu fixed='top' size='large' inverted>
                <Menu.Item name='Server Monitoring' header />
                <Menu.Item as={Link} to='/' name='Home' active={activeItem === 'Home'} onClick={this.handleItemClick} />
                <Menu.Item as={Link} to='/email' name='Email' active={activeItem === 'Email'} onClick={this.handleItemClick} />
            </Menu>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/email' component={Mail} />
            </Switch>
            </div>
            </BrowserRouter>
        )
    }
}

const Home = () => (
    <div>
        <SegmentContainer />
    </div>
)

const Mail = () => (
    <div>
        <EmailContainer />
    </div>
)