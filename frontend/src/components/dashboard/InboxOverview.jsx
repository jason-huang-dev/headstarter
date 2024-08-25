import React, { useState, useEffect } from 'react';
import { Button } from '../reusable'; // Adjust import path as necessary
import { Mail } from 'lucide-react';
import { useUserContext } from '../../contexts/userDataHandler';
/**
 * Returns an inbox view component
 * @param {Array<Object>} invitations - List of invitation objects
 * @returns A div containing the Inbox component
 */
const InboxOverview = () => {
  const { invitations, acceptInvitation} = useUserContext(); // Get acceptInvitation and fetchSharedCalendars from userDataHandler
  console.log(invitations)
  const handleInvitationResponse = async (token, action) => {
    acceptInvitation(token, action);
    //await fetchSharedCalendars(); // Refresh the list of shared calendars
    // Update local state to remove the responded invitation
    // setUpdatedInvitations(prev => prev.filter(inv => inv.token !== token));
  };

  return (
    <div className="h-full pt-5">
      {invitations.length === 0 ? (
        <p className="text-center text-gray-500">No invitations available.</p>
      ) : (
        <ul className="space-y-2">
          {invitations.map((invitation, index) => (
            <li key={index} className="relative flex flex-col py-2 px-3 my-1 font-medium rounded-md bg-white shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center leading-4">
                    <Mail style={{ width: '32px', height: '32px' }} />
                  </div>
                  <span className="ml-2 text-sm">{invitation.invited_by.username + " invited you to join the " + invitation.calendar.title + " calendar"}</span>
                </div>
                {!invitation.accpeted || !invitation.declined && 
                  (<div className="flex space-x-2">
                    <Button onClick={() => handleInvitationResponse(invitation.token, 'accept')} className="bg-green-500 text-white">
                      Accept
                    </Button>
                    <Button onClick={() => handleInvitationResponse(invitation.token, 'decline')} className="bg-red-500 text-white">
                      Decline
                    </Button>
                  </div>
                )}
                {(invitation.accepted || invitation.declined) &&
                  (<div className="flex space-x-2">
                    <span className={`ml-2 text-sm ${invitation.accepted ? "text-green-700" : "text-red-700"}`}>
                      {invitation.accepted ? "Accepted" : "Declined"}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InboxOverview;