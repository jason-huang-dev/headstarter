import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useUserContext } from '../../contexts/userDataHandler';
import moment from 'moment'; 
import { momentLocalizer } from 'react-big-calendar'; 

// Initialize the moment localizer
const localizer = momentLocalizer(moment);

/**
 * Returns an Invitations overview
 * @param {Array<Object>} events - the events to be displayed/rendered
 * @param {boolean} isRightBarOpen - if the dashboard's right bar is open
 * @param {Function} setIsRightBarOpen - function to set the dashboard's right bar's open status
 * @param {String} rightBarContent - String stating what the right bar should display
 * @param {Function} setRightBarContent - function to set the right bar content string
 * @returns A div containing the Invitation component
 */
const InboxOverview = () => {
  const { invitations, acceptInvitation } = useUserContext();
  const [currentTab, setCurrentTab] = useState('current'); // Default tab

  const handleInvitationResponse = async (token, action) => {
    acceptInvitation(token, action);
  };

  const renderInvitations = (filterFn) => {
    const filteredInvitations = invitations.filter(filterFn);
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleDateString(undefined, options);
    };

    return filteredInvitations.length === 0 ? (
      <p className="text-center text-gray-500">No invitations available.</p>
    ) : (
      <ul className="space-y-2 mt-15 max-h-90 overflow-y-auto">
        {filteredInvitations.map((invitation, index) => (
          <li 
            key={index} 
            className="relative flex flex-col py-2 px-5 my-2 mx-10 font-small rounded-lg border hover:bg-gray-100 transition-colors duration-300">
          
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center leading-4 p-2">
                  <Mail style={{ width: '24px', height: '24px' }} />
                </div>
                <span className="ml-4 text-base text-gray-700">
                  {`${invitation.invited_by.username} invited you to join the ${invitation.calendar.title} calendar`}
                </span>
              </div>
              {!invitation.accepted && !invitation.declined && (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleInvitationResponse(invitation.token, 'accept')} 
                    className="bg-green-700 hover:bg-green-600 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors duration-300">
                    Accept
                  </button>
                  <button 
                    onClick={() => handleInvitationResponse(invitation.token, 'decline')} 
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors duration-300">
                    Decline
                  </button>
                </div>
              )}
              {(invitation.accepted || invitation.declined) && (
                <div className="flex space-x-2">
                  <span 
                    className={`ml-4 text-sm font-semibold 
                    ${invitation.accepted ? 'text-green-600' : 'text-red-600'}`}>
                    {invitation.accepted ? 'Accepted' : 'Declined'}
                  </span>
                </div>
              )}
            </div>

          {/* Display the date on top */}
          <div className="text-gray-500 text-sm">
            {formatDate(invitation.created_at)}
          </div>

          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="h-full pt-5">
      <div className="flex justify-center mb-5">
        <button
          onClick={() => setCurrentTab('current')}
          className={`btn px-6 py-2.5 text-sm border border-r-0 rounded-l-xl uppercase transition-colors
            ${currentTab === 'current' ? 'bg-gray-100 font-bold text-black' : 'text-gray-400 hover:bg-gray-100 hover:font-bold'}`}>
          Current
        </button>
        <button
          onClick={() => setCurrentTab('sent')}
          className={`btn px-6 py-2.5 text-sm border uppercase transition-colors
            ${currentTab === 'sent' ? 'bg-gray-100 font-bold text-black' : 'text-gray-400 hover:bg-gray-100 hover:font-bold'}`}>
          Sent
        </button>
        <button
          onClick={() => setCurrentTab('history')}
          className={`btn px-6 py-2.5 text-sm border border-l-0 rounded-r-xl uppercase transition-colors
            ${currentTab === 'history' ? 'bg-gray-100 font-bold text-black' : 'text-gray-400 hover:bg-gray-100 hover:font-bold'}`}>
          History
        </button>
      </div>

      {currentTab === 'current' && renderInvitations(invitation => !invitation.accepted && !invitation.declined)}
      {currentTab === 'sent' && renderInvitations(invitation => invitation.sent_by_user)}
      {currentTab === 'history' && renderInvitations(invitation => invitation.accepted || invitation.declined)}
    </div>
  );
};

export default InboxOverview;
