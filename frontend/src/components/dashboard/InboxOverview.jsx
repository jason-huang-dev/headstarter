'use client';
import React from 'react';
import { Button } from '../reusable'; // Adjust import path as necessary
import { Inbox } from 'lucide-react';

/**
 * Returns an inbox view component
 * @param {Array<Object>} invitations - List of invitation objects
 * @returns A div containing the Inbox component
 */
const InboxOverview = ({ invitations }) => {
  const handleAccept = (invite_token) => {
    // Logic for accepting an invitation
    console.log(`Accepted invitation ${invite_token}`);
  };

  const handleDecline = (invite_token) => {
    // Logic for declining an invitation
    console.log(`Declined invitation ${invite_token}`);
  };

  console.log("Invite Overview Invitations: ",invitations)
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
                    <Inbox style={{ width: '32px', height: '32px' }} />
                  </div>
                  <span className="ml-2 text-sm">{invitation.title}</span>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleAccept(invitation.token)} className="bg-green-500 text-white">
                    Accept
                  </Button>
                  <Button onClick={() => handleDecline(invitation.token)} className="bg-red-500 text-white">
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
