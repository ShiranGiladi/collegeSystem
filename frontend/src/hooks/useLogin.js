import { useState } from 'react'
import { useAuthContext  } from './useAuthContext'

export const useLogin = () => {
    const[error, setError] = useState(null)
    const[isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    
    const login = async (username, password) => {
        setIsLoading(true)
        setError(null)
        // console.log("url", process.env.SERVER_URL)
        const response = await fetch(`https://college-system-pixh.onrender.com/api/user/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        const json = await response.json()

        if(!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if(response.ok) {
            // save the user to local storge
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({type: 'LOGIN', payload: json})

            setIsLoading(false)
        }
    }

    return { login, isLoading, error}
}