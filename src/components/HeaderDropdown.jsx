import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import boardIcon from '../assests/icon-board.svg'
import darkIcon from '../assests/icon-dark-theme.svg'
import lightIcon from '../assests/icon-light-theme.svg'
import { Switch } from '@headlessui/react'
import useDarkMode from '../Hooks/useDarkMode'


function HeaderDropdown({ setOpenDropDown }) {
    const [colorTheme, setTheme] = useDarkMode()
    const [darkSide, setDarkSide] = useState(
        colorTheme === 'light' ? true : false
    )

    const toggleDarkMode = (checked) => {
        const newTheme = checked ? 'dark' : 'light';
        setTheme(newTheme)
        setDarkSide(checked);
    }

    const boards = useSelector((state) => state.boards)

    return (
        <div className=' py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-16 bg-[#00000080]'
            onClick={
                (e) => {
                    if (e.target !== e.currentTarget) {
                        return
                    }
                    setOpenDropDown(false)
                }
            }>
            {/* Dropdown Modal*/}

            <div
                className=' bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a] w-full py-4 rounded-xl'>
                <h3 className=' dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8'>
                    All Boards ({boards?.length})
                </h3>

                <div>
                    {boards.map((board, index) => (
                        <div className={` flex items-baseline space-x-2 px-5 py-4 ${board.isActive && 'bg-[#635fc7] dark:bg-[#4b4c63] rounded-r-full text-white mr-8'}`}
                            key={index}>
                            <img src={boardIcon} className=' h-4' />
                            <p className=' text-lg font-bold dark:text-gray-300'>{board.name}</p>
                        </div>
                    ))}

                    <div className=' flex items-baseline space-x-2 text-[#635fc7] dark:text-[#9d9bf4] px-5 py-4'>
                        <img src={boardIcon} className=' h-4' />
                        <p
                            className=' text-lg font-bold'
                        >
                            Create New Board
                        </p>
                    </div>

                    <div
                        className=' mx-2 p-4 space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg'
                    >
                        <img src={lightIcon} />

                        <Switch
                            checked={darkSide}
                            onChange={toggleDarkMode}
                            className={` ${darkSide ? 'bg-[#635fc7]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >

                            <span
                                className={`${darkSide ? 'translate-x-6' : 'translate-x-1'}
                        inline-block h-4 w-4 transform
                        rounded-full bg-white transition
                        `}
                            >

                            </span>

                        </Switch>

                        <img src={darkIcon} />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderDropdown
