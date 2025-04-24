import { verifyJWT } from "../utils/jwt.js";

function auth(req, res, next) {
    const cookie= req.headers.cookie;
    if (!cookie) {
      return res.status(401).send("user not authenticated");
    }
  const authToken = req.cookies.authToken;
  if (!authToken) {
    return res.status(401).send("user not authenticated");
  }
  try {
    const data = verifyJWT(authToken);
    req.user = data; 
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(400).send("invalid token");
  }
}
export default auth;