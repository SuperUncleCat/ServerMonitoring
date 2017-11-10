import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Loader, Table, Grid, Icon, Button, Modal, Form } from 'semantic-ui-react'
import { initState, deleteState, addState, editState } from '../reducers/reducer'
import MailComponent from '../components/Mail'
const axios = require('axios')

class MailContainer extends Component {
    static propTypes = {
        data: PropTypes.array,
        onInitEmails: PropTypes.func,
        onDelEmail: PropTypes.func,
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
        }, 10000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        window.location.reload()
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
                            <Table.HeaderCell>Email Address</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <MailComponent mail_data = {this.props.data} onDelEmail={this.handleDeleteEmail.bind(this)} />
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MailContainer)