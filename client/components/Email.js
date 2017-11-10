import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import EmailListBox from './EmailList'

export default class EmailComponent extends Component {
    static propTypes = {
        posts_data: PropTypes.array,
        onDelEmail: PropTypes.func,
    }

    static defaultProps = {
        //posts_data: []
    }

    handleDeleteEmail(index) {
        if (this.props.onDelEmail) {
            this.props.onDelEmail(index)
        }
    }

    render() {
        return (
            <Table.Body>
                {this.props.posts_data.map((post_data, i) => <EmailListBox
                post_data={post_data}
                key={i}
                index={i} onDelEmail={this.handleDeleteEmail.bind(this)} />

            )}
            </Table.Body>
        )
    }
}