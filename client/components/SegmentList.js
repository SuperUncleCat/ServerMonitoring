import React, { Component, PropTypes } from 'react'
import ListContainer from '../containers/ListContainer'


export default class SegmentList extends Component {
    static propTypes = {
        posts_data: PropTypes.array,
        onDeleteServer: PropTypes.func,
    //onEditServer: PropTypes.func
    }
    static defaultProps = {
        posts_data: []
    }

    handleDeleteServer(index) {
        if (this.props.onDeleteServer) {
            this.props.onDeleteServer(index)
        }
    }

    /*handleEditServer(index) {
        if (this.props.onEditServer) {
            this.props.onEditServer(index)
        }
    }*/

    render() {
        return (
            <div>
                {this.props.posts_data.map((data, i) => <ListContainer
                post_data={data}
                key={i}
                index={i} onDeleteServer={this.handleDeleteServer.bind(this)} />
            )}
            </div>
        )
    }
}