import axios from "axios"
import { adminNavBar, userNavBar } from "../navbar-items/navbar-items"
import {  ADMIN_ACCOUNT, USER_ACCOUNT } from "./ApiService"
import { createHttpHeader, url } from "./HttpService"

export const getUser = (request) => {
    const api = request.role == "ADMIN" ? ADMIN_ACCOUNT : USER_ACCOUNT;
    axios.get(url+api +"/"+request.userName,createHttpHeader())
    .then(res=> {
        if(res && res.data) {
            localStorage.setItem("account",JSON.stringify(res.data))
            localStorage.setItem("isUserAuthenticated",true)
            if(res.data.role === "ADMIN"){
                localStorage.setItem("navBarArr",JSON.stringify(adminNavBar))
            }else {
                localStorage.setItem("navBarArr",JSON.stringify(userNavBar))

            }
            request.callBack("success")

        }

    }).catch(err=> {
        console.log(err)
        request.callBack("error")
    })
}

export const getUserDetails=()=>{
    return JSON.parse(localStorage.getItem("account"));
}

export const isUserAuthenticated=()=>{
    return JSON.parse(localStorage.getItem("isUserAuthenticated"));
}