import React, { useState } from 'react';

function UserSelection({ users, selectedUserId, onSelectUser, onAddUser }) {
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = () => {
    if (newUserName.trim()) {
      onAddUser(newUserName);
      setNewUserName('');
    }
  };

  return (
    <div className="user-selection">
      
      <div className="add-user">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="New user name"
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <select className="add-user"
        value={selectedUserId || ''}
        onChange={(e) => onSelectUser(e.target.value)}
      >
        <option value="">Select a user</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>
            {user.name} (Starting Points: {user.totalPoints})
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserSelection;