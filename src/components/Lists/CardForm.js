// src/components/CardForm.js
import React, { useState } from 'react';
import axios from 'axios';

const CardForm = ({ card, onSave, onCancel }) => {
  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:5000/api/cards/${card}`, 
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave();
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-100">
      <h2 className="text-lg font-semibold text-blue-600 mb-4">Edit Card</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardForm;
