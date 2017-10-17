import React, { Component } from 'react'
import { Container, Divider, Header, Menu, Segment } from 'semantic-ui-react'

const MenuFix = () => (
    <Menu fixed='top' size='large' inverted>
      <Container>
        <Menu.Item as='a' header>
          Server Monitoring
        </Menu.Item>
      </Container>
    </Menu>
)
export default MenuFix