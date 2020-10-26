import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const AuthSeletor = ({permissions, children}) => {
    const permission = useSelector(state => state.auth.permission)
    const history = useHistory()
    if (!permission) {
        history.push('/login')
    } else if (!permissions.includes(permission)) {
        return null
    } else {
        return children
    }
}

export default AuthSeletor
