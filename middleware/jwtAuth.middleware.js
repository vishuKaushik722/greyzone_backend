import jwt from "jsonwebtoken";
import HttpException from "../utils/HttpException.utils.js";

export default function JWTverification(req,res){
    const authHeader = req.headers.authorization;
    const bearer = 'Bearer ';

    if (!authHeader || !authHeader.startsWith(bearer)) {
        throw new HttpException(401, 'Access denied. No credentials sent!');
    }

    const token = authHeader.replace(bearer, '');

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const util = decoded.user.split("_id: ");
    const decodedID = util[1].substring(0,24);


    return decodedID;
}
