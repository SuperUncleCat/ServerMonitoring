import React, { Component } from 'react'
import { Container, Divider, Header, Menu, Segment } from 'semantic-ui-react'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import SegmentContainer from '../containers/SegmentContainer'
import MailContainer from '../containers/Mail'
import AppRoot from './app'

const routes = [{
    component: AppRoot,
    routes: [{
        path: '/',
        exact: true,
        component: SegmentContainer
    }, {
        path: '/list',
        component: MailContainer
    }]
}];

export default routes;