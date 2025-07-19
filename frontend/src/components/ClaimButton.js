import React from 'react';

function ClaimButton({ selectedUserId, onClaim, isClaiming }) {
  return (
    <button 
      onClick={() => onClaim(selectedUserId)}
      disabled={!selectedUserId || isClaiming}
    >
      {isClaiming ? 'Claiming...' : 'Claim Points'}
    </button>
  );
}

export default ClaimButton;