import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const BreakoutRoomsContext = createContext();

export const BreakoutRoomsProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);
    const { } = usePubSub("BREAKOUT", {
        onMessageReceived,
        onOldMessagesReceived
    });

    function onOldMessagesReceived(messages) {

        messages.forEach((message) => {
            const type = message.payload.type;
    
            switch (type) {
                case "addRoom":
                    addRoom(message.payload.roomName, message.payload.roomId);
                    break;
    
                case "addParticipant":
                    // console.log(message.payload.roomId, message.payload.participantId);
                    addParticipantToRoom(message.payload.roomId, message.payload.participantId);
                    // addParticipantToRoom(message.payload.roomId, message.senderId);
                    break;
    
                case "deleteRoom":
                    deleteRoom(message.payload.roomId);
                    break; // Add break here to prevent fall-through
    
                case "removeParticipant":
                    removeParticipantFromRoom(message.payload.roomId, message.payload.participantId);
                    break;
    
                default:
                    break;
            }
        });
    }
    

    function onMessageReceived(message) {
        const type = message.payload.type;
        switch (type) {
            case "addRoom":
                addRoom(message.payload.roomName, message.payload.roomId);
                break;
            case "addParticipant":
                // console.log(message.payload.roomId, message.payload.participantId);
                
                addParticipantToRoom(
                    message.payload.roomId,
                    message.payload.participantId
                );
                // addParticipantToRoom(
                //     message.payload.roomId,
                //     message.senderId
                // )
                break;
            case "deleteRoom":
                deleteRoom(message.payload.roomId);
            case "removeParticipant":
                removeParticipantFromRoom(message.payload.roomId,
                    message.payload.participantId);
                break;
            default:
                break;
        }
    }

    const addRoom = async (roomName, roomId) => {
        const newRoom = {
            id : roomId,
            name: roomName || `breakout-Test`, // Use roomName from message or fallback
            participants: [],
        };

        setRooms((prevRooms) => [...prevRooms, newRoom]);
    }

    // Delete Room
    const deleteRoom = (roomId) => {
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
    };

    // Add participant to a room using functional update
    const addParticipantToRoom = (roomId, participantId) => {
        // console.log("Participant ID to add inside room", participantId)
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId
                    ? {
                        ...room,
                        participants: room.participants.includes(participantId)
                            ? room.participants // Do not add if participant already exists
                            : [...room.participants, participantId], // Add participant if not exists
                    }
                    : room
            )
        );
    };


    // Remove participant from a room using functional update
    const removeParticipantFromRoom = (roomId, participantId) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId
                    ? {
                        ...room,
                        participants: room.participants.filter((p) => p !== participantId),
                    }
                    : room
            )
        );
    };

    return (
        <BreakoutRoomsContext.Provider
            value={{
                rooms,
                addRoom,
                deleteRoom,
                addParticipantToRoom,
                removeParticipantFromRoom,
            }}
        >
            {children}
        </BreakoutRoomsContext.Provider>
    );
};

export const useBreakoutRooms = () => useContext(BreakoutRoomsContext);
