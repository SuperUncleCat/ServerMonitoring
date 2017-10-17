import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Table } from 'semantic-ui-react'
import ListContainer from '../containers/ListContainer'

export default class SegmentList extends Component {
    static propTypes = {
        posts_data: PropTypes.array,
        onDeleteServer: PropTypes.func,
    }

    static defaultProps = {
        posts_data: []
    }

    handleDeleteServer(index) {
        if (this.props.onDeleteServer) {
            this.props.onDeleteServer(index)
        }
    }

    render() {
        return (
            <Table.Body>
				{this.props.posts_data.map((post_data, i) => <ListContainer
                post_data={post_data}
                key={i}
                index={i} onDeleteServer={this.handleDeleteServer.bind(this)} />

            )}
      		</Table.Body>
        )
    }
}