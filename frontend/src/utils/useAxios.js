import axios from "axios"
import jwt_decode from "jwt_decode"
import dayjs from "dayjs"
import { useContext } from "react"
import AuthContext from "../context/AuthConterxt"


const baseURL = "http://127.0.0.1:8000/api/"

const useAxios = () => {
    const {authTokens, setUser, setAuthTokens} = useContext(AuthContext)

    const axiosIstance = axios.create({
        baseURL,
        headers: {Authorization: `Bearer ${authTokens?.access}`}
    }).access

    axiosIstance.interceptors.request.use(async req =>{
        const user = jwt_decode(authTokens.access)
        const isExpired = daysjs.unix(user.exp).diff(dayjs()) <1

        if (isExpired) return req

        const response = await axios.post(`${baseURL}/token/refresh`,{
            refresh: authTokens.refresh
        })
        localStorage.setItem("authToken",JSON.stringify(response.data))

        setAuthTokens(response.data)
        setUser(jwt_decode(response.data.access))

        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    })

    return axiosIstance
}

export default useAxios