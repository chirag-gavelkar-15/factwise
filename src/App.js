import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

 
  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => {
        
        setUsers(data);
      })
      .catch((error) => console.error('Error loading data:', error));
  }, []);

 
  const filterUsers = (searchUser) => {
    searchUser = searchUser.toLowerCase();
    const newUsers = users.filter((user) => {
      const name = `${user.first} ${user.last}`.toLowerCase();
      return name.includes(searchUser);
    });
    setFilteredUsers(newUsers);
  };

  return (
    <div className='App'>
      <h1>FactWise Assessment</h1>

    
      <input
        type='text'
        placeholder='Search user'
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          filterUsers(e.target.value);
        }}
        className='search-bar'
      />

      {filteredUsers.length === 0 && searchTerm.trim().length !== 0 && (
        <h1>No user found</h1>
      )}
     
      <div className='user-list'>
        {searchTerm.trim().length === 0 &&
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => setEditingUser(user)}
              onDelete={() => setDeleteDialog(user)}
            />
          ))}
        {searchTerm.trim().length !== 0 &&
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => setEditingUser(user)}
              onDelete={() => setDeleteDialog(user)}
            />
          ))}
      </div>

     
      {editingUser && (
        <EditDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            setUsers(
              users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
            setEditingUser(null);
          }}
        />
      )}

      
      {deleteDialog && (
        <DeleteDialog
          user={deleteDialog}
          onCancel={() => setDeleteDialog(null)}
          onConfirm={() => {
            setUsers(users.filter((u) => u.id !== deleteDialog.id));
            setDeleteDialog(null);
          }}
        />
      )}
    </div>
  );
}

const UserCard = ({ user, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <div className='user-card'>
      <div className='user-header' onClick={() => setIsOpen(!isOpen)}>
        <img src={user.picture} alt='User Avatar' className='avatar' />
        <span>{`${user.first} ${user.last}`}</span>
        <button className='toggle-btn'>{isOpen ? '▲' : '▼'}</button>
      </div>
      {isOpen && (
        <div className='user-details'>
          <p>
            <strong>Age:</strong>
            {user.age}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Country:</strong> {user.country}
          </p>
          <p>
            <strong>Description:</strong> {user.description}
          </p>
          <div className='actions'>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

const EditDialog = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className='dialog'>
      <h2>Edit {user.name}</h2>
      <input
        name='age'
        value={formData.age}
        onChange={handleChange}
        placeholder='Age'
      />
      <input
        name='gender'
        value={formData.gender}
        onChange={handleChange}
        placeholder='Gender'
      />
      <input
        name='country'
        value={formData.country}
        onChange={handleChange}
        placeholder='Country'
      />
      <textarea
        name='description'
        value={formData.description}
        onChange={handleChange}
        placeholder='Description'
      ></textarea>
      <div className='dialog-actions'>
        <button onClick={() => onSave(formData)}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const DeleteDialog = ({ user, onCancel, onConfirm }) => (
  <div className='dialog'>
    <p>Are you sure you want to delete {user.name}?</p>
    <button onClick={onCancel}>Cancel</button>
    <button onClick={onConfirm} className='delete'>
      Delete
    </button>
  </div>
);

export default App;
