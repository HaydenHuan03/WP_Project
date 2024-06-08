import React from 'react'
import logo from '../assests/logo-mobile.svg'
import iconDown from "../assests/icon-chevron-down.svg";
// import iconUp from "../assests/icon-chevron-up.svg";

function Header() {
    // Check dropdown is opened or not
    // const [openDropDown, setOpenDropDown] = useState(false)


  return (
    <div className=' p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0'>
        <header className='flex justify-between dark:text-white items-center'>

            {/* Left Side */}

            <div className='flex items-center space-x-2 md:space-x-4 '>
                <img src={logo} alt="logo" className=' h-6 w-6'/>
                <h3 className=' hidden md:inline-block font-bold font-sans md:text-2xl'>
                    SuperLollipop Task Manager
                </h3>
                <div>
                    <h3 className=' truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans'>
                        board Name
                    </h3>
                    <img src={openDropDown ? iconUp :iconDown} alt="dropdown icon" className=' w-3 ml-2 md:hidden'/>

                </div>
            </div>

        </header>

    </div>
  )
}

export default Header