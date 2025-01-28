export interface LoginResponse{
    token?:string,
    user?:object
    ok:boolean,
    message:string,
    iat:string
}

export interface SignupResponse{
    user?:object
    ok:boolean,
    message:string,
    iat:string
}

export interface MeResponse{
    user:object,
    ok:boolean,
    iat:string
}