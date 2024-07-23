import React, { useState } from "react";
import Card from "./Card";
import { Draggable, Droppable } from "react-beautiful-dnd";

function List({ list, index, onDelete, onDeleteCard }) {
  const [isCardFormVisible, setCardFormVisible] = useState(false);
  
  const handleCardCreated = () => {
    setCardFormVisible(false);
  };

  const handleCardFormToggle = () => {
    setCardFormVisible(!isCardFormVisible);
  };


  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white w-80 border border-gray-300 rounded-lg shadow-md m-2"
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex bg-blue-600 justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-white">{list.title}</h3>
            <button
              onClick={() => onDelete(list._id)}
              className="text-[white] bg-red-500 rounded-md p-1 m-2 text-[14px] hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </div>

          <Droppable droppableId={list._id} type="CARD">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4 min-h-[100px] space-y-2"
              >
                {list.cards.length > 0 ? (
                  list.cards.map((card, index) => (
                    <Card
                      key={card._id}
                      card={card}
                      index={index}
                      onDelete={() => onDeleteCard(card._id, list._id)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No cards available</p>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          
          {/* Optional: Card form visibility toggle button */}
          {/* 
          <button
            onClick={handleCardFormToggle}
            className="w-full bg-blue-500 text-white py-2 rounded-b-lg hover:bg-blue-600"
          >
            {isCardFormVisible ? "Hide Card Form" : "Add New Card"}
          </button> 
          */}
        </div>
      )}
    </Draggable>
  );
}

export default List;
