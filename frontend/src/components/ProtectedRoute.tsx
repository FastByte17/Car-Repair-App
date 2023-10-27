import { useEffect, ElementType, useState } from 'react'
import jwt_decode from "jwt-decode";
import { Route, Redirect } from 'react-router-dom';


type Props = { redirectPath: string, component: ElementType }

const ProtectedRoute = ({ redirectPath = '/login', component: Component, ...rest }: Props | any) => {
    const [isAuthenticated, setIsAuthenticated] = useState<string | null>(localStorage.getItem('token'))

    const getWithExpiry = (key: string) => {
        const token = localStorage.getItem(key)

        if (!token) {
            return setIsAuthenticated(null)
        }
        const decoded: { exp: number } = jwt_decode(token);
        const { exp } = decoded
        const expirationDateObject = new Date(exp * 1000);
        const now = new Date()
        // compare the expiry time of the item with the current time
        if (now.getTime() > expirationDateObject.getTime()) {
            localStorage.removeItem('token')
            return setIsAuthenticated(null)
        }

        return setIsAuthenticated(token)
    }


    useEffect(() => {
        getWithExpiry('token')
    }, [isAuthenticated])


    return (
        <Route
            {...rest}
            render={(props) =>
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