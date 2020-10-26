import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Input, Label, Button } from '@windmill/react-ui'

import { signUp } from '../redux/actions/auth'
import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'

function Login() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const validEmail = () => { return email === '' || email.includes('@')}
  const validPassword = () => { return password === '' || password.length >= 8}
  const validPassword2 = () => { return (password === '' && password2 === '') || password2 === password }

  const submitForm = () => {
    if (!(email.length > 0) || !(password.length > 0)) {
      // TODO: se modal or error message.
      throw new Error('Email or password was not provided');
    }
    dispatch(signUp(email, password))
  }

  if (token.length > 0) {
    return <Redirect to="/app" />
  }
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>
              <Label>
                <span>Email</span>
                <Input className="mt-1" type="email" placeholder="john@doe.com" valid={validEmail()} onChange={e => setEmail(e.target.value)}/>
              </Label>
              <Label className="mt-4">
                <span>Password</span>
                <Input className="mt-1" placeholder="***************" type="password" valid={validPassword()} onChange={e => setPassword(e.target.value)}/>
              </Label>
              <Label className="mt-4">
                <span>Confirm password</span>
                <Input className="mt-1" placeholder="***************" type="password" valid={validPassword2()} onChange={e => setPassword2(e.target.value)}/>
              </Label>

              {/* <Label className="mt-6" check>
                <Input type="checkbox" />
                <span className="ml-2">
                  I agree to the <span className="underline">privacy policy</span>
                </span>
              </Label> */}

              <Button block className="mt-4" disabled={!validEmail() || !validPassword() || !validPassword2()} onClick={submitForm}>
                Create account
              </Button>

              <hr className="my-8" />

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
