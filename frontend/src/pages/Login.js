import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import { toast } from 'react-hot-toast'
import Context from '../context'
import LoadingDots from './LoadingDots.js'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const dataApi = await dataResponse.json()

            if(dataApi.success) {
                toast.success(dataApi.message)
                navigate('/')
                await Promise.all([
                    fetchUserDetails(),
                    fetchUserAddToCart()
                ])
            }

            if(dataApi.error) {
                toast.error(dataApi.message)
            }
        } catch (error) {
            toast.error("Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <section id='login'>
            <div className='mx-auto container p-4'>
                <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons'/>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label>Email : </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='email' 
                                    placeholder='enter email' 
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    disabled={loading}
                                    className='w-full h-full outline-none bg-transparent'/>
                            </div>
                        </div>

                        <div>
                            <label>Password : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='enter password'
                                    value={data.password}
                                    name='password' 
                                    onChange={handleOnChange}
                                    disabled={loading}
                                    className='w-full h-full outline-none bg-transparent'/>
                                <div className='cursor-pointer text-xl' onClick={()=>setShowPassword(prev=>!prev)}>
                                    <span>
                                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </span>
                                </div>
                            </div>
                            <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                                Forgot password ?
                            </Link>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 disabled:bg-red-400 disabled:hover:scale-100'>
                            {loading ? (
                                <span className="inline-flex items-center">
                                    Logging<LoadingDots />
                                </span>
                            ) : 'Login'}
                        </button>
                    </form>

                    <p className='my-5'>Don't have account ? <Link to={"/sign-up"} className=' text-red-600 hover:text-red-700 hover:underline'>Sign up</Link></p>
                </div>
            </div>
        </section>
    )
}

export default Login