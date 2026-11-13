import React, { useEffect, useState } from "react";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { useBreakoutRooms } from "../../context/BreakoutRoomsContext";
import { v4 as uuidv4 } from 'uuid';

export default function Controls({ isHost }) {
    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f4f6f9',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        buttonBase: {
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            margin: '5px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            ':hover': {
                backgroundColor: '#2980b9',
            }
        },
        disabledButton: {
            backgroundColor: '#bdc3c7',
            cursor: 'not-allowed',
        },
        input: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
        },
        select: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
        },
        popup: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            zIndex: 1000,
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
        },
        popupButtons: {
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
        },
        acceptButton: {
            backgroundColor: '#2ecc71',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
        },
        rejectButton: {
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
        }
    };

    const { leave, toggleMic, toggleWebcam, participants, localParticipant } = useMeeting();
    const { publish } = usePubSub("BREAKOUT");
    const [isRoomCreated, setIsRoomCreated] = useState(false);
    const [selectedInviteeId, setSelectedInviteeId] = useState("");
    const [selectedRemoveId, setSelectedRemoveId] = useState("");
    const [breakoutRoomName, setBreakoutRoomName] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const { rooms } = useBreakoutRooms();
    const [hostInsideMeeting, setHostInsideMeeting] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);

    useEffect(() => {
        const hosts = Array.from(participants)
            .filter(([participantId, participant]) => participant.metaData.isHost)
            .map(([participantId]) => participantId);

        setHostInsideMeeting(hosts);
    }, [participants]);

    useEffect(() => {
        setIsRoomCreated(rooms.length > 0);
    }, [rooms]);

    const receivedRoomRequest = (message) => {
        setCurrentRequest(message);
        setIsPopupVisible(true);
    };

    const { publish: publishtoHost } = usePubSub("BREAKOUT_JOIN_REQUEST", {
        onMessageReceived: receivedRoomRequest,
    });

    const isLocalInBreakoutRoom = () => {
        return rooms.some((room) =>
            room.participants.includes(localParticipant.id)
        );
    };

    const localInBreakout = isLocalInBreakoutRoom();

    const handleAcceptRequest = () => {
        publish("Accepted room request", { persist: true }, {
            type: "addParticipant",
            roomId: currentRequest.payload.roomId,
            participantId: currentRequest.senderId,
        });
        setIsPopupVisible(false);
    };

    const handleRejectRequest = () => {
        setIsPopupVisible(false);
    };

    function generateNumericUID() {
        const uid = uuidv4();
        return uid.replace(/[^0-9]/g, '').slice(0, 8);
    }

    const breakoutRoomId = generateNumericUID();

    const createBreakoutRoom = () => {
        publish("Created new breakout room", { persist: true }, {
            type: "addRoom",
            roomName: breakoutRoomName,
            roomId: breakoutRoomId
        });

        setBreakoutRoomName("");
    };

    const sendInvite = (roomId, participantId) => {
        if (rooms.length === 0) {
            alert("Please create Breakout Room!!");
        } else {
            try {
                publish(
                    "Please join the breakout room",
                    { persist: true },
                    {
                        type: "addParticipant",
                        roomId: roomId,
                        participantId: participantId,
                    }
                );
            } catch (e) {
                console.log("Error", e);
            }
        }
    };

    const removeParticipant = (roomId, participantId) => {
        try {
            publish(
                "Participant removed from breakout room",
                { persist: true },
                {
                    type: "removeParticipant",
                    roomId: roomId,
                    participantId: participantId,
                }
            );
        } catch (e) {
            console.log("Error", e);
        }
    };

    const removeBreakoutRoom = (roomId) => {
        try {
            publish(
                "Removed breakout room",
                { persist: true },
                {
                    type: "deleteRoom",
                    roomId: roomId,
                }
            );
        } catch (e) {
            console.log("Error", e);
        }
    };

    const joinBreakoutRoom = (roomId) => {
        if (localInBreakout) {
            try {
                publish("Leave Breakout Room", { persist: true }, {
                    type: "removeParticipant", roomId: roomId,
                    participantId: localParticipant.id,
                })
            } catch (e) {
                console.log("Error", e);
            }
        } else {
            try {
                publish(
                    "Please join the breakout room",
                    { persist: true },
                    {
                        type: "addParticipant",
                        roomId: roomId,
                        participantId: localParticipant.id,
                    }
                );
            } catch (e) {
                console.log("Error", e);
            }
        }
    }

    return (
        <div style={styles.container}>
            <div>
                <button style={styles.buttonBase} onClick={() => leave()}>Leave</button>
                <button style={styles.buttonBase} onClick={() => toggleMic()}>Toggle Mic</button>
                <button style={styles.buttonBase} onClick={() => toggleWebcam()}>Toggle Camera</button>
            </div>

            {isHost && (
                <div>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Breakout Room Name"
                            value={breakoutRoomName}
                            onChange={(e) => setBreakoutRoomName(e.target.value)}
                            style={styles.input}
                        />
                        <button
                            onClick={createBreakoutRoom}
                            style={styles.buttonBase}
                        >
                            Create Breakout Room
                        </button>
                    </div>

                    {isRoomCreated && (
                        <div>
                            <select
                                value={selectedRoomId}
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                style={styles.select}
                            >
                                <option value="">--Select Room--</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                style={{
                                    ...styles.buttonBase,
                                    ...(selectedRoomId ? {} : styles.disabledButton)
                                }}
                                onClick={() => selectedRoomId && removeBreakoutRoom(selectedRoomId)}
                                disabled={!selectedRoomId}
                            >
                                Remove Selected Room
                            </button>

                            <button
                                style={{
                                    ...styles.buttonBase,
                                    ...(selectedRoomId ? {} : styles.disabledButton)
                                }}
                                onClick={() => selectedRoomId && joinBreakoutRoom(selectedRoomId)}
                                disabled={!selectedRoomId}
                            >
                                {localInBreakout ? "Leave Selected Room" : "Join Breakout Room"}
                            </button>
                        </div>
                    )}

                    <div>
                        <select
                            value={selectedInviteeId}
                            onChange={(e) => setSelectedInviteeId(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">--Select Participant--</option>
                            {Array.from(participants)
                                .filter(([participantId, participant]) => {
                                    const isInBreakoutRoom = rooms.some((room) =>
                                        room.participants.includes(participantId)
                                    );
                                    return !participant.local && !isInBreakoutRoom;
                                })
                                .map(([participantId, participant]) => (
                                    <option key={participantId} value={participantId}>
                                        {participant.displayName || `Participant ${participantId}`}
                                    </option>
                                ))}
                        </select>

                        <button
                            style={{
                                ...styles.buttonBase,
                                ...(selectedInviteeId ? {} : styles.disabledButton)
                            }}
                            onClick={() =>
                                selectedInviteeId &&
                                sendInvite(selectedRoomId, selectedInviteeId)
                            }
                            disabled={!selectedInviteeId}
                        >
                            Invite
                        </button>
                    </div>

                    <div>
                        <select
                            value={selectedRemoveId}
                            onChange={(e) => setSelectedRemoveId(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">--Select Participant--</option>
                            {Array.from(participants)
                                .filter(([participantId, participant]) => {
                                    const isInBreakoutRoom = rooms.some((room) =>
                                        room.participants.includes(participantId)
                                    );
                                    return !participant.local && isInBreakoutRoom;
                                })
                                .map(([participantId, participant]) => (
                                    <option key={participantId} value={participantId}>
                                        {participant.displayName || `Participant ${participantId}`}
                                    </option>
                                ))}
                        </select>

                        <button
                            style={{
                                ...styles.buttonBase,
                                ...(selectedRemoveId ? {} : styles.disabledButton)
                            }}
                            onClick={() =>
                                selectedRemoveId &&
                                removeParticipant(selectedRoomId, selectedRemoveId)
                            }
                            disabled={!selectedRemoveId}
                        >
                            Remove
                        </button>
                    </div>

                    {isPopupVisible && currentRequest && (
                        <div style={styles.popup}>
                            <h3>{currentRequest.senderName} requested to join room</h3>
                            <div style={styles.popupButtons}>
                                <button
                                    style={styles.acceptButton}
                                    onClick={handleAcceptRequest}
                                >
                                    Accept
                                </button>
                                <button
                                    style={styles.rejectButton}
                                    onClick={handleRejectRequest}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!isHost && isRoomCreated && !localInBreakout && (
                <div>
                    <select
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">--Select Room--</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name}
                            </option>
                        ))}
                    </select>
                    <button
                        style={{
                            ...styles.buttonBase,
                            ...(selectedRoomId ? {} : styles.disabledButton)
                        }}
                        onClick={() => {
                            publishtoHost("Request to enter Breakout Room", {
                                persist: true,
                                sendOnly: hostInsideMeeting,
                            }, { roomId: selectedRoomId });
                        }}
                        disabled={!selectedRoomId}
                    >
                        Request to Join Breakout Room
                    </button>
                </div>
            )}
        </div>
    );
}