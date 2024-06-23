import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

function ProtectedRoute({children}) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  console.log(isAuthenticated)

  return isAuthenticated? children : <Navigate to="/"/>
}

export default ProtectedRoute