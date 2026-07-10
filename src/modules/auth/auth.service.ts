import { prisma } from "../../config/prisma";
import AppError from "../../utils/AppError";
import { generateToken } from "../../utils/jwt";
import { LoginUser, RegisterUser } from "./auth.interface";
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


const login = async(payload:LoginUser)=>{
    const user = await prisma.user.findUnique({
        where:{
            email:payload.email,
        }
    });

    if(!user){
        throw new AppError(404, "User not found");
    }
    const isMatched =await bcrypt.compare(
        payload.password,user.password
    )

     if (!isMatched) {
    throw new AppError(401, "Invalid credentials");
  }

  const token =generateToken({
    id:user.id,role:user.role,
  });

  const {password,...userInfo}=user;

  return{
    token,user:userInfo,
  }
}

const me = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return user;
};

export const AuthService={
    register,login,me
}