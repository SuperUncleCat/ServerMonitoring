import React, { Component } from 'react'
import { Popup, Button, Header, Modal } from 'semantic-ui-react'
import FormEdit from './FormEdit'

class PopModal extends Component {
    state = {
        open: false
    }

    show = dimmer => () => this.setState({
        dimmer,
        open: true
    })
    close = () => this.setState({
        open: false
    })

    render() {
        const {open, dimmer} = this.state

        return (
            <div>
              <Modal dimmer={dimmer} open={open} onClose={this.close}>
              <Modal.Header>Edit</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <FormEdit />
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button color='black' onClick={this.close}>
                  Nope
                </Button>
                <Button positive icon='checkmark' labelPosition='right' content="Submit" onClick={this.close} />
              </Modal.Actions>
              </Modal>
            </div>
        )
    }
}

export default PopModal