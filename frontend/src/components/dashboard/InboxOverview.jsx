import React, { useState, useEffect } from 'react';
import { Button } from '../reusable'; // Adjust import path as necessary
import { Inbox } from 'lucide-react';
import userDataHandler from './userDataHandler'; // Import userDataHandler

/**
 * Returns an inbox view component
 * @param {Array<Object>} invitations - List of invitation objects
 * @returns A div containing the Inbox component
 */
const InboxOverview = ({ invitations }) => {
  const { acceptInvitation, setInvitations } = userDataHandler(); // Get acceptInvitation and setInvitations from userDataHandler
  const [updatedInvitations, setUpdatedInvitations] = useState(invitations);

  return (
    <div className="h-full pt-5">
      {updatedInvitations.length === 0 ? (
        <p className="text-center text-gray-500">No invitations available.</p>
      ) : (
        <ul className="space-y-2">
          {updatedInvitations.map((invitation, index) => (
            <li key={index} className="relative flex flex-col py-2 px-3 my-1 font-medium rounded-md bg-white shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center leading-4">
                    <Inbox style={{ width: '32px', height: '32px' }} />
                  </div>
                  <span className="ml-2 text-sm">{invitation.title}</span>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => acceptInvitation(invitation.token, 'accept')} className="bg-green-500 text-white">
                    Accept
                  </Button>
                  <Button onClick={() => acceptInvitation(invitation.token, 'decline')} className="bg-red-500 text-white">
                    Decline
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InboxOverview;