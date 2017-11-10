import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
//import { withRouter } from 'react-router'
import { editState } from '../reducers/reducer'
import { Router, Route, hashHistory } from 'react-router'
import { Segment, Icon, Table, Modal, Button, Form, Input, Checkbox } from 'semantic-ui-react'
const axios = require('axios')
class ListContainer extends Component {
    static propTypes = {
        post_data: PropTypes.object.isRequired,
        onDeleteServer: PropTypes.func,
        onEditServer: PropTypes.func,
        //onInitServers: PropTypes.func,
        index: PropTypes.number
    }

    constructor(props) {
        super(props)
        this.state = ({
            ischeck: props.post_data.is_check,
            pcheck: props.post_data.p_check,
            servername: props.post_data.server_name,
            jpname: props.post_data.jp_name,
            ipaddress: props.post_data.ip_address,
            port: props.post_data.port,
            priority: props.post_data.priority
        })
    }

    static defaultProps = {
        data: []
    }

    handleDeleteServer(index) {
        if (this.props.onDeleteServer) {
            this.props.onDeleteServer(this.props.index)
        } else {
            console.log("error")
        }
    }

    handleIsCheckChange() {
        this.setState({
            ischeck: !this.state.ischeck
        })
    }

    handlePCheckChange() {
        this.setState({
            pcheck: !this.state.pcheck
        })
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
    }

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
    }*/

    handleSubmit(index) {
        axios.post('/edit', {
            querymark: this.props.post_data._id,
            ischeck: this.state.ischeck,
            pcheck: this.state.pcheck,
            servername: this.state.servername,
            jpname: this.state.jpname,
            ipaddress: this.state.ipaddress,
            port: this.state.port,
            priority: this.state.priority
        }).then((response) => {
            if (response.data.success === false) {
                alert("error")
            } else if (this.props.post_data.priority == this.state.priority) {
                /*console.log(this.props.post_data.ip_address)
                    console.log(this.props.post_data)
                    dispatch(onEditServer(index, {
                //querymark: this.props.post_data._id,
                servername: this.props.post_data.server_name,
                jpname: this.props.post_data.jp_name,
                ipaddress: this.props.post_data.ip_address,
                port: this.props.post_data.port,
                priority: this.props.post_data.priority,
                id,
                    }))*/
            } else {
                //window.location.reload();
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
        var updated_time = (new Date(post_data.updated_at)).toLocaleString().replace('/T/', '').replace('/\../+', '')
        var port_state_color = function() {
            if (post_data.port_state == "green") {
                return "green"
            } else if (post_data.port_state == "red") {
                return "red"
            } else
                return "yellow"
        }()
        var port_icon_name = function() {
            if (post_data.port_state == "green") {
                return "smile"
            } else if (post_data.port_state == "red") {
                return "warning sign"
            } else
                return "minus circle"
        }()
        var ping_state_color = function() {
            if (post_data.ping_state == "green") {
                return "green"
            } else if (post_data.ping_state == "red") {
                return "red"
            } else
                return "yellow"
        }()
        var ping_icon_name = function() {
            if (post_data.ping_state == "green") {
                return "smile"
            } else if (post_data.ping_state == "red") {
                return "warning sign"
            } else
                return "minus circle"
        }()

        return (
            <Table.Row>
            <Table.Cell><Icon name={port_icon_name} color={port_state_color}/></Table.Cell>
            <Table.Cell><Icon name={ping_icon_name} color={ping_state_color}/></Table.Cell>
            <Table.Cell>{post_data.jp_name}</Table.Cell>
            <Table.Cell>{post_data.ip_address}</Table.Cell>
            <Table.Cell>{post_data.port}</Table.Cell>
            <Table.Cell>{updated_time}</Table.Cell>
            <Table.Cell>{post_data.priority}</Table.Cell>
            <Table.Cell>
                <div>
                    <Icon link name='settings' color='purple' onClick={() => {
                this.setState({
                    open: true
                })
            }} />
                </div>
            </Table.Cell>
            <Table.Cell><Icon link name='trash' color='purple' onClick={this.handleDeleteServer.bind(this)} /></Table.Cell>
        </Table.Row>
        )
    /*return (
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
    )*/
    }

    renderOpen() {
        const {open} = this.state
        const post_data = this.props.post_data
        //var updated_time = (new Date(post_data.updated_at)).toLocaleString().replace('/T/', '').replace('/\../+', '')
        //var state_color = (post_data.state == "green") ? "green" : "red"
        //var icon_name = (post_data.state == "green") ? "smile" : "warning sign"
        return (
            <Table.Row>
            <Table.Cell>
                <Checkbox name="pCheck" label='Port Check' checked={this.state.pcheck} onChange={this.handlePCheckChange.bind(this)} />
            </Table.Cell>
            <Table.Cell>
                <Checkbox name="isCheck" label='Ping Check' checked={this.state.ischeck} onChange={this.handleIsCheckChange.bind(this)} />
            </Table.Cell>
            <Table.Cell>
            <Input size='small' value={this.state.servername} onChange={(e) => {
                this.setState({
                    servername: e.target.value
                })
            }}/>
            </Table.Cell>
            <Table.Cell>
            <Input size='small' value={this.state.jpname} onChange={(e) => {
                this.setState({
                    jpname: e.target.value
                })
            }}/>
            </Table.Cell>
            <Table.Cell>
            <Input size='small' style={{
                width: '10em'
            }} value={this.state.ipaddress} onChange={(e) => {
                this.setState({
                    ipaddress: e.target.value
                })
            }}/>
            </Table.Cell>
            <Table.Cell>
            <Input size='small' style={{
                width: '5em'
            }} value={this.state.port} onChange={(e) => {
                this.setState({
                    port: e.target.value
                })
            }}/>
            </Table.Cell>
            <Table.Cell>
            <Input size='small' style={{
                width: '5em'
            }} value={this.state.priority} onChange={(e) => {
                this.setState({
                    priority: e.target.value
                })
            }}/>
            </Table.Cell>
            <Table.Cell>
                <div>
                    <Icon link name='checkmark' color='purple' onClick={(this.handleSubmit.bind(this))} />
                </div>
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

const mapStateToProps = (state) => {
    return {
        data: state.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onEditServer: (index, data) => {
            dispatch(editState(index, data))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListContainer)