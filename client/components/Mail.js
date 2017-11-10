import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import MailList from './MailList'

export default class MailComponent extends Component {
    static propTypes = {
        mail_data: PropTypes.array,
        onDelEmail: PropTypes.func,
    }

    static defaultProps = {
        mail_data: []
    }

    handleDeleteEmail(index) {
        if (this.props.onDelEmail) {
            this.props.onDelEmail(index)
        }
    }

    render() {
        return (
            <Table.Body>
                {this.props.mail_data.map((post_data, i) => <MailList
                email_post_data={post_data}
                key={i}
                index={i} onDelEmail={this.handleDeleteEmail.bind(this)} />

            )}
            </Table.Body>
        )
    }
}