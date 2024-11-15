// import React, { useContext, useState } from 'react'
// import Logo from './Logo'
// import { GrSearch } from "react-icons/gr";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { FaShoppingCart } from "react-icons/fa";
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import SummaryApi from '../common';
// import { toast } from 'react-toastify'
// import { setUserDetails } from '../store/userSlice';
// import ROLE from '../common/role';
// import Context from '../context';

// const Header = () => {
//   const user = useSelector(state => state?.user?.user)
//   const dispatch = useDispatch()
//   const [menuDisplay,setMenuDisplay] = useState(false)
//   const context = useContext(Context)
//   const navigate = useNavigate()
//   const searchInput = useLocation()
//   const URLSearch = new URLSearchParams(searchInput?.search)
//   const searchQuery = URLSearch.getAll("q")
//   const [search,setSearch] = useState(searchQuery)

//   const handleLogout = async() => {
//     const fetchData = await fetch(SummaryApi.logout_user.url,{
//       method : SummaryApi.logout_user.method,
//       credentials : 'include'
//     })

//     const data = await fetchData.json()

//     if(data.success){
//       toast.success(data.message)
//       dispatch(setUserDetails(null))
//       navigate("/")
//     }

//     if(data.error){
//       toast.error(data.message)
//     }

//   }

//   const handleSearch = (e)=>{
//     const { value } = e.target
//     setSearch(value)

//     if(value){
//       navigate(`/search?q=${value}`)
//     }else{
//       navigate("/search")
//     }
//   }
//   return (
//     <header className='h-16 shadow-md bg-white fixed w-full z-40'>
//       <div className=' h-full container mx-auto flex items-center px-4 justify-between'>
//             <div className=''>
//                 <Link to={"/"}>
//                     <Logo w={90} h={50}/>
//                 </Link>
//             </div>

//             <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
//                 <input type='text' placeholder='search product here...' className='w-full outline-none' onChange={handleSearch} value={search}/>
//                 <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
//                   <GrSearch />
//                 </div>
//             </div>


//             <div className='flex items-center gap-7'>
                
//                 <div className='relative flex justify-center'>

//                   {
//                     user?._id && (
//                       <div className='text-3xl cursor-pointer relative flex justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
//                         {
//                           user?.profilePic ? (
//                             <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
//                           ) : (
//                             <FaRegCircleUser/>
//                           )
//                         }
//                       </div>
//                     )
//                   }
                  
                  
//                   {
//                     menuDisplay && (
//                       <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded' >
//                         <nav>
//                           {
//                             user?.role === ROLE.ADMIN && (
//                               <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
//                             )
//                           }
                         
//                         </nav>
//                       </div>
//                     )
//                   }
                 
//                 </div>

//                   {
//                      user?._id && (
//                       <Link to={"/cart"} className='text-2xl relative'>
//                           <span><FaShoppingCart/></span>
      
//                           <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
//                               <p className='text-sm'>{context?.cartProductCount}</p>
//                           </div>
//                       </Link>
//                       )
//                   }
              


//                 <div>
//                   {
//                     user?._id  ? (
//                       <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
//                     )
//                     : (
//                     <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
//                     )
//                   }
                    
//                 </div>

//             </div>

//       </div>
//     </header>
//   )
// }

// export default Header




import React, { useContext, useState, useEffect } from 'react';
import Logo from './Logo';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const URLSearch = new URLSearchParams(location?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and after any auth state changes
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/check-auth`, {
          credentials: 'include'
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const fetchData = await fetch(`${process.env.REACT_APP_API_URL}${SummaryApi.logout_user.url}`, {
        method: SummaryApi.logout_user.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await fetchData.json();

      if (data.success) {
        dispatch(setUserDetails(null));
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  };

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div>
          <Link to="/">
            <Logo w={90} h={50} />
          </Link>
        </div>

        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input
            type='text'
            placeholder='search product here...'
            className='w-full outline-none px-3 py-2'
            onChange={handleSearch}
            value={search}
          />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white cursor-pointer'>
            <GrSearch />
          </div>
        </div>

        <div className='flex items-center gap-7'>
          <div className='relative flex justify-center'>
            {isAuthenticated && user?._id && (
              <div
                className='text-3xl cursor-pointer relative flex justify-center'
                onClick={() => setMenuDisplay(prev => !prev)}
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} className='w-10 h-10 rounded-full object-cover' alt={user.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to="/admin-panel/all-products"
                      className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2'
                      onClick={() => setMenuDisplay(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          {isAuthenticated && user?._id && (
            <Link to="/cart" className='text-2xl relative'>
              <span><FaShoppingCart /></span>
              <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                <p className='text-sm'>{context?.cartProductCount || 0}</p>
              </div>
            </Link>
          )}

          <div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-white ${
                  isLoading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                } transition-colors duration-200 flex items-center justify-center min-w-[80px]`}
              >
                {isLoading ? 'Loading...' : 'Logout'}
              </button>
            ) : (
              <Link
                to="/login"
                className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors duration-200'
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;