import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const FormEdit = () => {
    return (
        <Form>
        <Form.Field width={7}>
          <label>ServerName</label>
          <input placeholder={post_data.jp_name} />
        </Form.Field>
        <Form.Field width={7}>
          <label>JP Name</label>
          <input placeholder='JP Name' />
        </Form.Field>
        <Form.Field width={7}>
          <label>IP Address</label>
          <input placeholder='IP Address' />
        </Form.Field>
        <Form.Field width={7}>
          <label>Priority</label>
          <input placeholder='Priority' />
        </Form.Field>
        </Form>
    )
}

FormEdit.propTypes = {
    post_data: PropTypes.object.isRequired
}

export default FormEdit