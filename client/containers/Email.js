import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Loader, Table, Grid, Icon, Button, Modal, Form } from 'semantic-ui-react'
import { initState, deleteState, addState, editState } from '../reducers/reducer'
import EmailComponent from '../components/Email'
const axios = require('axios')

class EmailContainer extends Component {
    static propTypes = {
        data: PropTypes.array,
        onInitEmails: PropTypes.func,
        onDelEmail: PropTypes.func,
        onAddEmail: PropTypes.func,
        onEditEmail: PropTypes.func
    }

    constructor() {
        super()
        this.state = {
            emailaddress: '',
            status: ''
        }
    }

    componentWillMount() {
        this._loadEmailData()
    }

    componentDidMount() {
        if (this.timer) {
            clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
            this._loadEmailData()
        }, 3000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }


    _loadEmailData() {
        if (!Object.keys) {
            Object.keys = ( function() {
                'use strict';
                var hasOwnProperty = Object.prototype.hasOwnProperty,
                    hasDontEnumBug = !({
                            toString: null
                        }).propertyIsEnumerable('toString'),
                    dontEnums = [
                        'toString',
                        'toLocaleString',
                        'valueOf',
                        'hasOwnProperty',
                        'isPrototypeOf',
                        'propertyIsEnumerable',
                        'constructor'
                    ],
                    dontEnumsLength = dontEnums.length;

                return function(obj) {
                    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                        throw new TypeError('Object.keys called on non-object');
                    }

                    var result = [],
                        prop,
                        i;

                    for (prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) {
                            result.push(prop);
                        }
                    }

                    if (hasDontEnumBug) {
                        for (i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) {
                                result.push(dontEnums[i]);
                            }
                        }
                    }
                    return result;
                };
            }());
        }
        let email_data = [];
        let email_posts_data = [];
        let response = axios.post('/mailshow')
            .then((response) => {
                Object.keys(response.data).forEach(function(index) {
                    email_data.push(response.data[index]);
                })

                email_data.forEach((item, index) => {
                    email_posts_data.push(item);
                })
                this.props.onInitEmails(email_posts_data)
            //dispatch(initServers(posts_data))
            }).catch(() => {
        })
    }

    handleDeleteEmail(index) {
        const {data} = this.props
        axios.post('/maildelete', {
            id: data[index]._id
        }).then((response) => {
            if (response.data.success === false) {
                alert("error");
            } else {
            }
        }).catch(() => {
        })
        if (this.props.onDelEmail) {
            this.props.onDelEmail(index)
        }
    }

    handleMailCreate(email) {
        axios.post('/mailcreate', {
            emailaddress: this.state.emailaddress,
            status: this.state.status
        }).then((response) => {
            if (response.data.success === false) {
                alert("error");
            } else {
                //window.location.reload()
                dispatch(onAddEmail(index, {
                    emailaddress: this.state.emailaddress,
                    status: this.state.status
                }))
            }
        }).catch(() => {
        })
        this.setState({
            open: false
        })
    }

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

    state = {
        open: false
    }
    show = (size, dimmer) => () => this.setState({
        size,
        dimmer,
        open: true
    })

    close = () => this.setState({
        open: false
    })

    render() {
        const {open, size, dimmer} = this.state
        return (
            <Grid>
            <Container style = {{
                marginTop: '6em',
            }}>
                <Table unstackable size='small'>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell colSpan='4'>
                            <Button basic color='violet' floated='right' icon labelPosition='left' primary size='tiny' onClick={this.show('small', 'blurring')}>
                                <Icon link color='violet' name='add' />Add
                            </Button>
                            <Modal size={size} dimmer={dimmer} open={open} onClose={this.close} closeIcon>
                            <Modal.Header>Add</Modal.Header>
                            <Modal.Content>
                                <Modal.Description>
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
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.close}>
                                    Nope
                                </Button>
                                <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={this.handleMailCreate.bind(this)} />
                            </Modal.Actions>
                            </Modal>
                        </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>Email Address</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <EmailComponent posts_data = {this.props.data} onDelEmail={this.handleDeleteEmail.bind(this)} />
                </Table> 
            </Container>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onInitEmails: (emails) => {
            dispatch(initState(emails))
        },
        onDelEmail: (index) => {
            dispatch(deleteState(index))
        },
        onEditEmail: (index) => {
            dispatch(editState(index))
        },
        onAddEmail: (email) => {
            dispatch(addState(email))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailContainer)