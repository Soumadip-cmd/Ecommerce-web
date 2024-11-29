import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import imageTobase64 from '../helpers/imageTobase64'
import SummaryApi from '../common'
import { toast } from 'react-hot-toast'
import LoadingDots from './LoadingDots'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
    address: "" // Added address field
  })
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUploadPic = async(e) => {
    const file = e.target.files[0]
    try {
      const imagePic = await imageTobase64(file)
      setData(prev => ({
        ...prev,
        profilePic: imagePic
      }))
    } catch (error) {
      toast.error("Image upload failed")
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(data.password !== data.confirmPassword) {
      return toast.error("Please check password and confirm password")
    }

    if(!data.address.trim()) {
      return toast.error("Please provide your delivery address")
    }
    
    setLoading(true)
    try {
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const dataApi = await dataResponse.json()

      if(dataApi.success) {
        toast.success(dataApi.message)
        navigate("/login")
      }

      if(dataApi.error) {
        toast.error(dataApi.message)
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id='signup'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <div>
              <img src={data.profilePic || loginIcons} alt='login icons'/>
            </div>
            <form>
              <label>
                <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                  Upload Photo
                </div>
                <input type='file' className='hidden' onChange={handleUploadPic} disabled={loading}/>
              </label>
            </form>
          </div>

          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Name : </label>
              <div className='bg-slate-100 p-2'>
                <input 
                  type='text' 
                  placeholder='enter your name' 
                  name='name'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  disabled={loading}
                  className='w-full h-full outline-none bg-transparent'/>
              </div>
            </div>

            <div className='grid'>
              <label>Email : </label>
              <div className='bg-slate-100 p-2'>
                <input 
                  type='email' 
                  placeholder='enter email' 
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  disabled={loading}
                  className='w-full h-full outline-none bg-transparent'/>
              </div>
            </div>

            {/* Added Address field */}
            <div className='grid'>
              <label>Delivery Address : </label>
              <div className='bg-slate-100 p-2'>
                <textarea 
                  placeholder='enter your delivery address' 
                  name='address'
                  value={data.address}
                  onChange={handleOnChange}
                  required
                  disabled={loading}
                  rows="3"
                  className='w-full h-full outline-none bg-transparent resize-none'/>
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
                  required
                  disabled={loading}
                  className='w-full h-full outline-none bg-transparent'/>
                <div className='cursor-pointer text-xl' onClick={()=>setShowPassword(prev=>!prev)}>
                  <span>{showPassword ? <FaEyeSlash/> : <FaEye/>}</span>
                </div>
              </div>
            </div>

            <div>
              <label>Confirm Password : </label>
              <div className='bg-slate-100 p-2 flex'>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder='enter confirm password'
                  value={data.confirmPassword}
                  name='confirmPassword' 
                  onChange={handleOnChange}
                  required
                  disabled={loading}
                  className='w-full h-full outline-none bg-transparent'/>
                <div className='cursor-pointer text-xl' onClick={()=>setShowConfirmPassword(prev=>!prev)}>
                  <span>{showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}</span>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 disabled:bg-red-400 disabled:hover:scale-100'>
              {loading ? (
                <span className="inline-flex items-center">
                  Signing <LoadingDots />
                </span>
              ) : 'Sign Up'}
            </button>
          </form>

          <p className='my-5'>Already have account ? <Link to={"/login"} className='text-red-600 hover:text-red-700 hover:underline'>Login</Link></p>
        </div>
      </div>
    </section>
  )
}

export default SignUp