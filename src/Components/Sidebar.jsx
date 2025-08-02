import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineDashboard } from 'react-icons/md';
import { CiSettings, CiMenuFries } from "react-icons/ci";
import { BiSolidUserDetail } from "react-icons/bi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { Tooltip } from 'react-tooltip';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); // 🟢 Get current path

  const data = [
  
    {
      path: '/hirer',
      icon: <BiSolidUserDetail size={25} />,
      text: 'Hirer Detail',
    },
    {
      path: '/settings',
      icon: <CiSettings size={25} />,
      text: 'Settings',
    },
    {
      path: '/help',
      icon: <IoMdHelpCircleOutline size={25} />,
      text: 'Help',
    },
  ];

  return (
    <div className={`h-screen ${isOpen ? 'w-[300px]' : 'w-[100px]'} bg-white shadow-lg p-6 flex flex-col transition-all duration-300`}>
      <div className='flex justify-between items-center'>
        <h2 className="text-xl font-bold text-purple-700 mb-8">
          {isOpen && 'HIRER PANEL'}
        </h2>
        <div className='mb-6 text-purple-900 cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
          <CiMenuFries size={25} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {data.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
                ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-100'}
              `}
            >
              <span
                data-tip={item.text}
                data-for="sidebar-tooltip"
                className={isOpen ? 'text-xl' : 'text-lg'}
              >
                {item.icon}
              </span>
              {isOpen && (
                <span className="text-base font-medium">{item.text}</span>
              )}
            </Link>
          );
        })}
      </div>

      {!isOpen && <Tooltip id="sidebar-tooltip" place="right" effect="solid" />}
    </div>
  );
};

export default Sidebar;
