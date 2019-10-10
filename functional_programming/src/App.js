/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import MethodChanning from './MethodChanning'
import FunctionalProgarmming from './FunctionalProgramming'
import './app.css'

export default function App() {
  return (
    <>
      <div className='nav'>
        <NavLink
          activeClassName='active'
          to='/method_channing'
        >Method Channing</NavLink>
        <NavLink
          activeClassName='active'
          to='/functional_programming'
        >Functional Programming</NavLink>
      </div>
      <Switch>
        <Route
          path='/method_channing'
          component={MethodChanning}
        />
        <Route
          path='/functional_programming'
          component={FunctionalProgarmming}
        />
      </Switch>
    </>
  )
}