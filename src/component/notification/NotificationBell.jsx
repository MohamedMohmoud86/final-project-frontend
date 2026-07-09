import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoIosNotifications } from "react-icons/io";
import { useLocation } from 'react-router-dom';
import './Notification.css';

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const bellRef = useRef(null); 
  const location = useLocation();

 
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`https://final-project-production-3b18.up.railway.app/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

 
  useEffect(() => {
    setIsOpen(false);
  }, [location]);


  useEffect(() => {
    const handleClickOutside = (event) => {
     
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    
   
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleBellClick = async () => {
    setIsOpen(!isOpen);
    
    if (!isOpen && unreadCount > 0) {
      try {
        await axios.put(`https://final-project-production-3b18.up.railway.app/api/notifications/read-all/${userId}`);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="notification_container" ref={bellRef} style={{ position: 'relative' }}>
      
      <a 
        href="#notifications" 
        className="bell_link_wrapper"
        onClick={(e) => {
          e.preventDefault(); 
          handleBellClick();  
        }}
      >
        <IoIosNotifications />
        {unreadCount > 0 && (
          <span className='count'>{unreadCount}</span>
        )}
      </a>

      {isOpen && (
        <div className="notifications_dropdown">
          <h4>Notifications</h4>
          {notifications.length === 0 ? (
            <p className="no_notif">No notifications yet</p>
          ) : (
            <div className="notif_list">
              {notifications.map((notif) => (
                <div key={notif._id} className={`notif_item ${!notif.isRead ? 'unread' : ''}`}>
                  <h5>{notif.title}</h5>
                  <p>{notif.message}</p>
                  <span className="notif_time">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}