import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NavMailList from './NavMailList'
import { Table } from 'semantic-ui-react'

export default class NavComponent extends Component {
    static propTypes = {
        mails_data: PropTypes.array,
        onDelEmail: PropTypes.func,
    }

    static defaultProps = {
        mails_data: []
    }

    handleDelMail(index) {
        if (this.props.onDelEmail) {
            this.props.onDelEmail(index)
        }
    }

    render() {
        return (
            <Table.Body>
                {this.props.mails_data.map((mail_data, i) => <NavMailList
                mail_data={mail_data}
                key={i}
                index={i} onDelEmail={this.handleDelMail.bind(this)} />

            )}
            </Table.Body>
        )
    }
}