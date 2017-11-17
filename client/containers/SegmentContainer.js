import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Loader, Table, Grid, Icon, Button, Modal, Form, Checkbox } from 'semantic-ui-react'
import SegmentList from '../components/SegmentContainer'
import { initState, deleteState, addState } from '../reducers/reducer'
const axios = require('axios')

class SegmentContainer extends Component {
    static propTypes = {
        data: PropTypes.array,
        onInitServers: PropTypes.func,
        onDeleteServer: PropTypes.func,
        onAddServer: PropTypes.func
    }

    constructor() {
        super()
        //this._loadData()
        /*this.state = {
            ischeck: true,
            pcheck: true,
            servername: '',
            jpname: '',
            ipaddress: '',
            port: '',
            priority: ''
        }*/
        this.state = {
            data: {}
        }
        this._loadData()
    //this._loadData = this._loadData.bind(this)
    }

    componentWillMount() {
        //this._loadtest()
    }

    componentDidMount() {
        if (this.timer) {
            clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
            //this._loadData()
            this._loadtest()
        }, 3000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    async _loadtest() {
        let sorted_data = [];
        let posts_data = [];
        await axios.post('/show')
            .then((response) => {
                Object.keys(response.data).forEach(function(index) {
                    sorted_data.push(response.data[index]);
                })

                sorted_data.forEach((item, index) => {
                    posts_data.push(item);
                })

                this.setState({
                    data: posts_data
                })
            }).catch((e) => {

        })
    }

    _loadData() {
        let sorted_data = [];
        let posts_data = [];
        let response = axios.post('/show')
            .then((response) => {
                Object.keys(response.data).forEach(function(index) {
                    sorted_data.push(response.data[index]);
                })

                /*function _dataCompare(a, b) {
                    if (a.priority > b.priority)
                        return 1;
                    if (a.priority < b.priority)
                        return -1;
                    return 0;
                }*/

                sorted_data.forEach((item, index) => {
                    posts_data.push(item);
                })
                //posts_data.sort(_dataCompare);
                //this.props.onInitServers(posts_data)
                this.setState({
                    data: posts_data
                })
            }).catch((e) => {

        })

    }

    handleDeleteServer(index) {
        const {data} = this.state
        axios.post('/delete', {
            id: data[index]._id
        }).then((response) => {
            if (response.data.success === false) {
                alert("error");
            } else if (data[index].priority !== data[data.length - 1].priority) {
                if (this.state.onDeleteServer) {
                    this.state.onDeleteServer(index)
                }
                window.location.reload()
            } else {
                if (this.state.onDeleteServer) {
                    this.state.onDeleteServer(index)
                }
            //window.location.reload();
            }
        }).catch(() => {
        })

    //window.location.reload();
    }

    /*handleEditServer(index) {
        const {servers} = this.props
        axios.post('/edit', {
            querymark: this.props.servers._id,
            servername: this.state.servername,
            jpname: this.state.jpname,
            ipaddress: this.state.ipaddress,
            port: this.state.port,
            priority: this.state.priority
        }).then((response) => {
            if (response.data.success === false) {
                alert("error")
            } else {
                //window.location.reload();
                dispatch(onEditServer(index, {
                    querymark: this.props.servers._id,
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
    }*/

    async handleCreate(server) {
        const {data} = this.state
        await axios.post('/create', {
            servername: this.state.servername,
            jpname: this.state.jpname,
            ipaddress: this.state.ipaddress,
            ischeck: this.state.ischeck,
            pcheck: this.state.pcheck,
            port: this.state.port,
            priority: this.state.priority
        }).then((response) => {
            if (response.data.success === false) {
                alert("error");
            } else if (this.state.priority > data[data.length - 1].priority) {
                /*dispatch(onAddServer(index, {
                    servername: this.state.servername,
                    jpname: this.state.jpname,
                    ipaddress: this.state.ipaddress,
                    ischeck: this.state.ischeck,
                    pcheck: this.state.pcheck,
                    port: this.state.port,
                    priority: this.state.priority
                }))*/
            } else {
                window.location.reload()
            }
        }).catch(() => {
        })
        this.setState({
            open: false
        })
    //window.location.reload();
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
        const data = this.state.data
        var predata = []
        var mark
        Object.keys(data).forEach(function(index) {
            if (data[index].ip_address) {
                mark = true
            } else {
                mark = false
            }
        })
        if (mark) {
            data.forEach((item, index) => {
                predata.push(item)
            })
        } else {
        }
        if (mark) {
            return (
                <Grid>
            <Container style = {{
                    marginTop: '6em',
                }}>
                <Table unstackable size='small'>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell colSpan='9'>
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
                                <Form.Field>
                                    <label>PingCheck:</label>
                                    <Checkbox name="isCheck" checked={this.state.ischeck} onChange={this.handleIsCheckChange.bind(this)} defaultChecked />
                                </Form.Field>
                                <Form.Field>
                                    <label>PortCheck:</label>
                                    <Checkbox name="pCheck" checked={this.state.pcheck} onChange={this.handlePCheckChange.bind(this)} defaultChecked />
                                </Form.Field>
                                </Form.Group>
                                </Form>
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.close}>
                                    Nope
                                </Button>
                                <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={this.handleCreate.bind(this)} />
                            </Modal.Actions>
                            </Modal>
                        </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>PortState<Loader active inline size='tiny' /></Table.HeaderCell>
                            <Table.HeaderCell>PingState<Loader active inline size='tiny' /></Table.HeaderCell>
                            <Table.HeaderCell>ServerName</Table.HeaderCell>
                            <Table.HeaderCell>IP Address</Table.HeaderCell>
                            <Table.HeaderCell>Port</Table.HeaderCell>
                            <Table.HeaderCell>Updated</Table.HeaderCell>
                            <Table.HeaderCell>Priority</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <SegmentList posts_data = {this.state.data} onDeleteServer={this.handleDeleteServer.bind(this)} />
                </Table> 
            </Container>
            </Grid>
            )
        } else {
            return (
                <Grid>
            <Container style = {{
                    marginTop: '6em',
                }}>
                <Table unstackable size='small'>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell colSpan='9'>
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
                                <Form.Field>
                                    <label>PingCheck:</label>
                                    <Checkbox name="isCheck" checked={this.state.ischeck} onChange={this.handleIsCheckChange.bind(this)} defaultChecked />
                                </Form.Field>
                                <Form.Field>
                                    <label>PortCheck:</label>
                                    <Checkbox name="pCheck" checked={this.state.pcheck} onChange={this.handlePCheckChange.bind(this)} defaultChecked />
                                </Form.Field>
                                </Form.Group>
                                </Form>
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='black' onClick={this.close}>
                                    Nope
                                </Button>
                                <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={this.handleCreate.bind(this)} />
                            </Modal.Actions>
                            </Modal>
                        </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>PortState<Loader active inline size='tiny' /></Table.HeaderCell>
                            <Table.HeaderCell>PingState<Loader active inline size='tiny' /></Table.HeaderCell>
                            <Table.HeaderCell>ServerName</Table.HeaderCell>
                            <Table.HeaderCell>IP Address</Table.HeaderCell>
                            <Table.HeaderCell>Port</Table.HeaderCell>
                            <Table.HeaderCell>Updated</Table.HeaderCell>
                            <Table.HeaderCell>Priority</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <SegmentList posts_data = {predata} onDeleteServer={this.handleDeleteServer.bind(this)} />
                </Table> 
            </Container>
            </Grid>
            )
        }

    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onInitServers: (servers) => {
            dispatch(initState(servers))
        },
        onDeleteServer: (index) => {
            dispatch(deleteState(index))
        },
        onAddServer: (server) => {
            dispatch(addState(server))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SegmentContainer)