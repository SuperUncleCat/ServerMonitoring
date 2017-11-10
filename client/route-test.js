import React, { Component } from 'react'
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import SegmentContainer from './containers/SegmentContainer'

const App = () => (
    <BrowserRouter>
    <div>
      <ul>
       <li><Link to='/'>Home</Link></li>
       <li><Link to='/about'>About</Link></li>
       <li><Link to='/friends'>Friends</Link></li>
     </ul>

     <hr />
     <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/about' component={About} />
      <Route path='/friends' component={Friends} />
     </Switch>
    </div>
  </BrowserRouter>
)

const Home = () => (
    <div>
        <SegmentContainer />
    </div>
)
const About = () => (
    <div>
    <h2>About</h2>
    <p>フレンズに投票するページです</p>
  </div>
)
const Friends = () => (
    <div>
    <h2>Friends</h2>
    <p>ここにフレンズのリストを書きます</p>
  </div>
)

export default App