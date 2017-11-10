import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Table } from 'semantic-ui-react'

export default class MailList extends Component {
    static propTypes = {
        email_post_data: PropTypes.object.isRequired,
        onDelEmail: PropTypes.func,
        index: PropTypes.number
    }

    constructor(props) {
        super(props)
        this.state = ({
            emailaddress: props.email_post_data.email_address,
            status: props.email_post_data.status,
        })
    }

    static defaultProps = {
        email_post_data: []
    }


    handleDelMail(index) {
        if (this.props.onDelEmail) {
            this.props.onDelEmail(this.props.index)
        } else {
            console.log("error")
        }
    }


    render() {
        const email_post_data = this.props.email_post_data
        if (email_post_data) {
            return (
                <Table.Row>
                <Table.Cell>{email_post_data.email_address}</Table.Cell>
                <Table.Cell>{email_post_data.status}</Table.Cell>
                <Table.Cell><Icon link name='trash' color='purple' onClick={this.handleDelMail.bind(this)} /></Table.Cell>
            </Table.Row>
            )
        }
    }
}