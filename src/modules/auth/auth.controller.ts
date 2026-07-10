import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const register = catchAsync(async(req:Request,res:Response)=>{
    const result =await AuthService.register(req.body);

    sendResponse(res,{
        statusCode:201,success:true,
        message:"User registered!",
        data:result,
    })
})

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const me = catchAsync(async (req, res) => {
    const result = await AuthService.me(req.user!.id);

    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Profile Retrieved",
        data:result
    });
});


export const AuthController = {
  register,
  login,me
};

