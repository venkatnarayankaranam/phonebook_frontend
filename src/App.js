import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPhone, setNewPhone] = useState({});
  const [phonebook, setPhonebook] = useState([]);

  const fetchPhonebook = () => {
    Axios.get('http://localhost:8080/get-phone')
      .then(res => {
        setPhonebook(res.data.data.phoneNumbers);
      })
      .catch(error => {
        console.error('There was an error fetching the phonebook!', error);
      });
  };

  useEffect(() => {
    fetchPhonebook();
  }, []);

  const addNewNumber = () => {
    Axios.post('http://localhost:8080/add-phone', { name, phone })
      .then(response => {
        console.log('Phone number added:', response.data);
        setName('');
        setPhone('');
        fetchPhonebook();
      })
      .catch(error => {
        console.error('There was an error adding the phone number!', error);
      });
  };

  const updatePhone = (id) => {
    if (!newPhone[id]) {
      alert("Please enter a new phone number.");
      return;
    }

    Axios.patch(`http://localhost:8080/update-phone/${id}`, { phone: newPhone[id] })
      .then(response => {
        console.log('Phone number updated:', response.data);
        setNewPhone(prevState => ({ ...prevState, [id]: '' }));
        fetchPhonebook();
      })
      .catch(error => {
        console.error('There was an error updating the phone number!', error);
      });
  };

  const deletePhone = (id) => {
    Axios.delete(`http://localhost:8080/delete-phone/${id}`)
      .then(response => {
        console.log('Phone number deleted:', response.data);
        fetchPhonebook();
      })
      .catch(error => {
        console.error('There was an error deleting the phone number!', error);
      });
  };

  const handleNewPhoneChange = (id, value) => {
    setNewPhone(prevState => ({ ...prevState, [id]: value }));
  };

  return (
    <div className="container">
      <div className="add-phone">
        <h2>Add New Phone Number</h2>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <label htmlFor="phone">Phone: </label>
        <input
          type="number"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        /><br /><br />

        <button onClick={addNewNumber}>Add New Number</button>
      </div>

      <div>
        <h1>PhoneBook List</h1>
        {phonebook.map((val, key) => (
          <div key={key} className="phone">
            <h1>{val.name}</h1>
            <h1>{val.phone}</h1>
            <input
              type="number"
              placeholder='Update Phone...'
              value={newPhone[val._id] || ''}
              onChange={(e) => handleNewPhoneChange(val._id, e.target.value)}
            />
            <button className='update-btn' onClick={() => updatePhone(val._id)}>Update</button>
            <button className='delete-btn' onClick={() => deletePhone(val._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


