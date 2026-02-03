import jwt from 'jsonwebtoken'

const auth = (requiredRole = null) => {
    return async (req, res, next) => {
        let token = req.headers['authorization']
        if (!token) return res.status(400).json({ msg: "Access denied - No token provided ⛔" })
    
        token = token.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {

            if (err) return res.status(400).json({ msg: "Invalid token ❌" })
            else {
                console.log(decoded)
                req.user = decoded

                if (requiredRole && decoded.role !== requiredRole) {
                    return res.status(403).json({ msg: "Access denied - Insufficient permissions ⛔" })
                }
                next()
                
            }
        })
    }
}

export default auth;