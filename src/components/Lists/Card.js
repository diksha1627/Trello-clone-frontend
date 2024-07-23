import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CardForm from './CardForm';
import Modal from './Modal';
import axios from 'axios';

function Card({ card, index, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [listId, setListId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    setCardTitle(card.title);
    setCardDescription(card.description);
  }, [card]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      // Handle invalid date
      return 'Invalid Date';
    }

    const optionsDate = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    const formattedDate = date.toLocaleDateString('en-GB', optionsDate);
    const formattedTime = date.toLocaleTimeString('en-GB', optionsTime);

    return `${formattedDate}, ${formattedTime}`;
  };

  const fetchCard = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`http://localhost:5000/api/cards/card/${card}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCardTitle(res.data.title);
      setCardDescription(res.data.description);
      setListId(res.data.list);
      setDate(formatDate(res.data.createdAt));
    } catch (error) {
      console.error('Error fetching card:', error);
    }
  };

  useEffect(() => {
    fetchCard();
  }, []);

  const handleDelete = () => {
    onDelete(card, listId);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleView = () => {
    setIsViewing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    fetchCard();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsViewing(false);
  };

  return (
    <>
      <Draggable draggableId={card} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="bg-blue-100 border border-gray-300 rounded-lg shadow-md p-4 m-2"
            style={{ ...provided.draggableProps.style }}
          >
            <h4 className="text-lg font-semibold text-blue-600">{cardTitle}</h4>
            <p className="text-gray-700">{cardDescription}</p>
            <h1 className="text-[12px]  text-gray-600">Created at: {date}</h1>

            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white text-[13px] p-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white text-[13px] p-2 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleView}
                className="bg-blue-500 text-[13px] text-white p-2 rounded-md hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </Draggable>

      <Modal isOpen={isEditing} onClose={handleCancel}>
        <CardForm card={card} onSave={handleSave} onCancel={handleCancel} />
      </Modal>

      <Modal isOpen={isViewing} onClose={handleCancel}>
        <div className="bg-white p-6 rounded-lg shadow-md w-100">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Card Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Title:</label>
              <p className="text-gray-900">{cardTitle}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Description:</label>
              <p className="text-gray-900">{cardDescription}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Created At:</label>
              <p className="text-gray-900">{date}</p>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Card;
