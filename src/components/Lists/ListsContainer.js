import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "./List";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar";

function ListsContainer() {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [selectedListId, setSelectedListId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
    }
  }, [navigate]);

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5000/api/lists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.length === 0) {
        await createDefaultLists();
      } else {
        setLists(res.data);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceListIndex = lists.findIndex(
      (list) => list._id === source.droppableId
    );
    const destinationListIndex = lists.findIndex(
      (list) => list._id === destination.droppableId
    );

    const sourceList = lists[sourceListIndex];
    const destinationList = lists[destinationListIndex];

    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destinationList.cards.splice(destination.index, 0, movedCard);

    const updatedLists = [...lists];
    updatedLists[sourceListIndex] = sourceList;
    updatedLists[destinationListIndex] = destinationList;

    setLists(updatedLists);

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        "http://localhost:5000/api/cards/reorder",
        { movedCard, source, destination },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating card position:", error);
    }
  };

  const createDefaultLists = async () => {
    const defaultLists = [
      { title: "To Do" },
      { title: "In Progress" },
      { title: "Done" },
    ];

    try {
      const token = localStorage.getItem("authToken");
      for (const list of defaultLists) {
        await axios.post("http://localhost:5000/api/lists", list, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      fetchLists();
    } catch (error) {
      console.error("Error creating default lists:", error);
    }
  };

  const handleListSubmit = async (event) => {
    event.preventDefault();

    if (!newListTitle.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "http://localhost:5000/api/lists",
        { title: newListTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewListTitle("");
      fetchLists();
    } catch (error) {
      console.error("Error creating new list:", error);
    }
  };

  const handleCardSubmit = async (event) => {
    event.preventDefault();

    if (!newCardTitle.trim() || !selectedListId) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "http://localhost:5000/api/cards",
        {
          title: newCardTitle,
          description: newCardDescription,
          listId: selectedListId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewCardTitle("");
      setNewCardDescription("");
      setSelectedListId("");
      fetchLists();
    } catch (error) {
      console.error("Error creating new card:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/api/lists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchLists();
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleDeleteCard = async (cardId, listId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/api/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists((prevLists) => {
        return prevLists.map((list) => {
          if (list._id === listId) {
            return {
              ...list,
              cards: list.cards.filter((card) => card !== cardId),
            };
          }
          return list;
        });
      });
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <div >
      <Navbar />
      <div className="p-4 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <form
            onSubmit={handleListSubmit}
            className="mb-4 flex justify-center items-center gap-2 w-[100%]"
          >
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="New List Title"
              className="p-2 border border-gray-300 rounded-md w-full  w-[85%]"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white w-[15%]  py-2 rounded-md hover:bg-blue-600"
            >
              Create New List
            </button>
          </form>

          <form onSubmit={handleCardSubmit} className="mb-4">
            <label className="text-blue-500 w-[15%] font-bold  py-2 rounded-md ">
              ADD TASK
            </label>
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Card Title"
              required
              className="p-2 border border-gray-300 rounded-md w-full mb-2"
            />
            <textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              placeholder="Card Description"
              required
              className="p-2 border border-gray-300 rounded-md w-full mb-2"
            />
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-md w-full mb-2"
            >
              <option value="">Select List</option>
              {lists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Create Task
            </button>
          </form>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-lists" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex space-x-4"
                >
                  {lists.map((list, index) => (
                    <List
                      key={list._id}
                      list={list}
                      index={index}
                      onDelete={handleDelete}
                      onDeleteCard={handleDeleteCard}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default ListsContainer;
