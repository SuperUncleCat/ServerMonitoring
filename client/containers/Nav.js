import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Provider } from 'react-redux'
import { withRouter } from 'react-router'
import { Menu, Modal, Button, Form, Table, Label, Icon } from 'semantic-ui-react'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import SegmentContainer from './SegmentContainer'
import MailContainer from './Mail'
import { initState, addState, deleteState } from '../reducers/reducer'
const axios = require('axios')

class Nav extends Component {

    static propTypes = {

        emailData: PropTypes.array,
        onAddEmail: PropTypes.func,
        onDelEmail: PropTypes.func
    }

    constructor() {
        super()
        this.state = {
            emailaddress: '',
            status: ''
        }
    }

    state = {
        activeItem: 'Home',
        open: false
    }

    show = size => () => this.setState({
        size,
        open: true
    })

    close = () => this.setState({
        open: false
    })

    handleItemClick = (e, {name}) => this.setState({
        activeItem: name
    })

    handleEmailAddressChange(event) {
        this.setState({
            emailaddress: event.target.value
        })
    }

    handleStatusChange(event) {
        this.setState({
            status: event.target.value
        })
    }


    handleMailCreate(email) {
        axios.post('/mailcreate', {
            emailaddress: this.state.emailaddress,
            status: this.state.status
        }).then((response) => {
            if (response.data.success === false) {
                alert("error");
            } else {
            }
        }).catch(() => {
        })
        this.setState({
            open: false
        })
        this.props.history.push('/')

    }

    render() {

        const {activeItem, open, size} = this.state

        return (
            <div>
            <Menu fixed='top' size='large' inverted>
                <Menu.Item name='Server Monitoring' header />
                <Menu.Item as={Link} to='/' name='Home' active={activeItem === 'Home'} onClick={this.handleItemClick} />
                <Menu.Item as={Link} to='/list' name='List' active={activeItem === 'List'} onClick={() => {
                console.log("Hi")
            }} />
                <Menu.Item><Button primary onClick={this.show('small')}>Email</Button></Menu.Item>
                <Modal size={size} open={open} onClose={this.close}>
                <Modal.Header>
                New Email Address
                </Modal.Header>
                <Modal.Content scrolling>
                <Form>
                <Form.Group width='equal'>
                <Form.Field>
                <label>Email Address</label>
                <input value={this.state.emailaddress} onChange={this.handleEmailAddressChange.bind(this)} />
                </Form.Field>
                <Form.Field>
                <label>Status</label>
                <input value={this.state.status} onChange={this.handleStatusChange.bind(this)} />
                </Form.Field>
                </Form.Group>
                </Form>
                </Modal.Content>
                <Modal.Actions>
                <Button negative onClick={this.close}>
                No
                </Button>
                <Button positive icon='checkmark' labelPosition='right' content='Submit' onClick={this.handleMailCreate.bind(this)} />
                </Modal.Actions>
                </Modal>
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

const mapStateToProps = (state) => {
    return {
        emailData: state.emailData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddEmail: (email) => {
            dispatch(addState(email))
        },
        onDelEmail: (index) => {
            dispatch(deleteState(index))
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav))