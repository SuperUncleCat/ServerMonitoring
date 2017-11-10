import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { editState } from '../reducers/reducer'
import { Router, Route, hashHistory } from 'react-router'
import { Segment, Icon, Table, Modal, Button, Form, Input } from 'semantic-ui-react'
const axios = require('axios')
export default class EmailListBox extends Component {
    static propTypes = {
        post_data: PropTypes.object.isRequired,
        onDelEmail: PropTypes.func,
        index: PropTypes.number
    }

    constructor(props) {
        super(props)
        this.state = ({
            emailaddress: props.post_data.email_address,
            status: props.post_data.status,
        })
    }

    static defaultProps = {
        data: []
    }

    handleDeleteEmail(index) {
        if (this.props.onDelEmail) {
            this.props.onDelEmail(this.props.index)
        } else {
            console.log("error")
        }
    }

    handleEmailSubmit(index) {
        axios.post('/mailedit', {
            querymark: this.props.post_data._id,
            emailaddress: this.state.emailaddress,
            status: this.state.status
        }).then((response) => {
            if (response.data.success === false) {
                alert("error")
            } else {
            }
        }).catch(() => {
        })
        this.setState({
            open: false
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
        if (this.state.open) {
            return this.renderOpen()
        }
        const {open} = this.state
        const post_data = this.props.post_data

        return (
            <Table.Row>
            <Table.Cell>{post_data.email_address}</Table.Cell>
            <Table.Cell>{post_data.status}</Table.Cell>

            <Table.Cell>
                <div>
                    <Icon link name='settings' color='purple' onClick={() => {
                this.setState({
                    open: true
                })
            }} />
                </div>
            </Table.Cell>
            <Table.Cell><Icon link name='trash' color='purple' onClick={this.handleDeleteEmail.bind(this)} /></Table.Cell>
        </Table.Row>
        )
    }

    renderOpen() {
        const {open} = this.state
        const post_data = this.props.post_data
        return (
            <Table.Row>
            <Table.Cell>
            <Input size='small' value={this.state.emailaddress} onChange={(e) => {
                this.setState({
                    emailaddress: e.target.value
                })
            }}/>
            </Table.Cell>
            <Table.Cell>
            <Input size='small' value={this.state.status} onChange={(e) => {
                this.setState({
                    status: e.target.value
                })
            }}/>
            </Table.Cell>
            <Table.Cell>
            <Icon link name='checkmark' color='purple' onClick={(this.handleEmailSubmit.bind(this))} />
            </Table.Cell>
            <Table.Cell>
            <Icon link name='remove' color='purple' onClick={() => {
                this.setState({
                    open: false
                })
            }}/>
            </Table.Cell>
        </Table.Row>
        )
    }
}