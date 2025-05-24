import { jwtDecode } from "jwt-decode"

interface DecodedToken {
    _id: string
    rule: number
    exp: number
    iat: number
}

export const getUserRule = (): number => {
    try {
        const tokenString = localStorage.getItem('auth')
        if (!tokenString) return 1
        const token = JSON.parse(tokenString).accesstoken
        const decoded: DecodedToken = jwtDecode(token)
        return decoded.rule
    } catch {
        return 1
    }
}