import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { Segment, Icon, Table, Modal, Button, Form } from 'semantic-ui-react'
const axios = require('axios')
class ListContainer extends Component {
    static propTypes = {
        post_data: PropTypes.object.isRequired,
        onDeleteServer: PropTypes.func,
        onEditServer: PropTypes.func,
        initServers: PropTypes.func,
        index: PropTypes.number
    }

    constructor(props) {
        super(props)
        this.state = ({
            servername: props.post_data.server_name,
            jpname: props.post_data.jp_name,
            ipaddress: props.post_data.ip_address,
            port: props.post_data.port,
            priority: props.post_data.priority
        })
    }

    static defaultProps = {
        servers: []
    }

    handleDeleteServer(index) {
        if (this.props.onDeleteServer) {
            this.props.onDeleteServer(this.props.index)
        } else {
            console.log("error")
        }
    }

    /*handleEditServer(index) {
        if (this.props.onEditServer) {
            this.props.onEditServer(this.props.index)
        } else {
            console.log("error")
        }
        this.setState({
            open: false
        })
    }*/

    handleServerNameChange(event) {
        this.setState({
            servername: event.target.value
        })
    }

    handleJPNameChange(event) {
        this.setState({
            jpname: event.target.value
        })
    }

    handleIPChange(event) {
        this.setState({
            ipaddress: event.target.value
        })
    }

    handlePORTChange(event) {
        this.setState({
            port: event.target.value
        })
    }

    handlePriorityChange(event) {
        this.setState({
            priority: event.target.value
        })
    }

    handleSubmit(index) {
        axios.post('/edit', {
            querymark: this.props.post_data._id,
            servername: this.state.servername,
            jpname: this.state.jpname,
            ipaddress: this.state.ipaddress,
            port: this.state.port,
            priority: this.state.priority
        }).then((response) => {
            var new_data;
            if (response.data.success === false) {
                alert("error")
            } else {
                window.location.reload();
                //console.log(this.props.post_data)
                dispatch(onEditServer(index, {
                    querymark: this.props.post_data._id,
                    servername: this.state.servername,
                    jpname: this.state.jpname,
                    ipaddress: this.state.ipaddress,
                    port: this.state.port,
                    priority: this.state.priority
                }))
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
        const {open, size, dimmer} = this.state
        const post_data = this.props.post_data
        var updated_time = (new Date(post_data.updated_at)).toLocaleString().replace('/T/', '').replace('/\../+', '')
        var state_color = (post_data.state == "green") ? "green" : "red"
        var icon_name = (post_data.state == "green") ? "smile" : "warning sign"
        return (
            <Table.Row>
                <Table.Cell><Icon name={icon_name} color={state_color}/></Table.Cell>
                <Table.Cell>{post_data.jp_name}</Table.Cell>
                <Table.Cell>{post_data.ip_address}</Table.Cell>
                <Table.Cell>{post_data.port}</Table.Cell>
                <Table.Cell>{updated_time}</Table.Cell>
                <Table.Cell>{post_data.priority}</Table.Cell>
                <Table.Cell>
                    <div>
                        <Icon link name='settings' color='purple' onClick={this.show('small', 'blurring')} />
                        <Modal size={size} dimmer={dimmer} open={open} onClose={this.close} closeIcon>
                        <Modal.Header>Edit</Modal.Header>             
                        <Modal.Content>
                            <Modal.Description>
                                <Form>
                                <Form.Group width='equal'>
                                <Form.Field>
                                    <label>Server Name</label>
                                    <input value={this.state.servername} onChange={this.handleServerNameChange.bind(this)} />
                                </Form.Field>
                                <Form.Field>
                                    <label>JP Name</label>
                                    <input value={this.state.jpname} onChange={this.handleJPNameChange.bind(this)} />
                                </Form.Field>
                                </Form.Group>
                                <Form.Group width='equal'>
                                <Form.Field>
                                    <label>IP Address</label>
                                    <input value={this.state.ipaddress} onChange={this.handleIPChange.bind(this)} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Priority</label>
                                    <input value={this.state.priority} onChange={this.handlePriorityChange.bind(this)} />
                                </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                <Form.Field>
                                    <label>Port</label>
                                    <input value={this.state.port} onChange={this.handlePORTChange.bind(this)} />
                                </Form.Field>
                                </Form.Group>
                                </Form>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                        <Button color='black' onClick={this.close}>
                            Nope
                        </Button>
                        <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={this.handleSubmit.bind(this)} />
                        </Modal.Actions>
                        </Modal>
                    </div>
                </Table.Cell>
                <Table.Cell><Icon link name='trash' color='purple' onClick={this.handleDeleteServer.bind(this)} /></Table.Cell>
            </Table.Row>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        servers: state.servers
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onEditServer: (index, data) => {
            dispatch(editServer(index, data))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListContainer)