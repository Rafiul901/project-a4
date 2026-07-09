import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppErro";
import { RegisterUser } from "./auth.interface";
import bcrypt from "bcrypt";
const register = async(payload:RegisterUser)=>{
    const existUser = await prisma.user.findUnique({
        where:{
            email:payload.email
        }
    })
    if(existUser){
    throw new AppError(409, "User already exists")
}
const hashedPassword = await bcrypt.hash(payload.password,10)

const user = await prisma.user.create({
    data:{
        ...payload,password:hashedPassword,
    }
});

const {password, ...result} =user;
return result

};

