import { useEffect, ElementType, useState } from 'react'
import jwt_decode from "jwt-decode";
import { Route, Redirect } from 'react-router-dom';


type Props = { redirectPath: string, component: ElementType }

const ProtectedRoute = ({ redirectPath = '/login', component: Component, ...rest }: Props | any) => {

    // Initialize the 'isAuthenticated' state and set it to the value of the 'token' stored in local storage.
    const [isAuthenticated, setIsAuthenticated] = useState<string | null>(localStorage.getItem('token'))

    // Function to get the 'token' from local storage and check its expiration.
    const getWithExpiry = (key: string) => {
        const token = localStorage.getItem(key)

        // If the 'token' doesn't exist, set 'isAuthenticated' to null.
        if (!token) {
            return setIsAuthenticated(null)
        }

        // Decode the 'token' to extract its expiration timestamp.
        const decoded: { exp: number } = jwt_decode(token);
        const { exp } = decoded
        const expirationDateObject = new Date(exp * 1000);
        const now = new Date()
        // Compare the expiry time of the item with the current time

        if (now.getTime() > expirationDateObject.getTime()) {
            // If the token has expired, remove it from local storage and set 'isAuthenticated' to null.
            localStorage.removeItem('token')
            return setIsAuthenticated(null)
        }

        // Set 'isAuthenticated' to the valid token.
        return setIsAuthenticated(token)
    }

    // useEffect to check the 'token' expiration when 'isAuthenticated' changes.
    useEffect(() => {
        getWithExpiry('token')
    }, [isAuthenticated])


    return (
        <Route
            {...rest}
            render={(props) =>
                // If 'isAuthenticated' or a 'token' in local storage exists, render the protected component.
                (isAuthenticated || localStorage.getItem('token')) ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )

            }
        />
    )
}
export default ProtectedRoute;