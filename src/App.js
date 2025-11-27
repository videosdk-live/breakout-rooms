import "./App.css";
import React, {
  useState,
} from "react";
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "./API";
import ParticipantView from "./components/meeting/ParticipantView";
import Controls from "./components/meeting/Controls";
import InvisibleParticipants from "./components/meeting/InvisibleParticipants";
import { BreakoutRoomsProvider, useBreakoutRooms } from "./context/BreakoutRoomsContext";


function JoinScreen({ getMeetingAndToken, setIsHost, setParticipantName }) {
  const [meetingId, setMeetingId] = useState(null);
  const [participantName, setName] = useState("");

  const onClick = async (isHost = null) => {
    if (participantName.trim().length <= 3) {
      alert("Participant name must be greater than 3 characters.");
      return;
    } else {
      setParticipantName(participantName)
    }

    if (isHost) {
      setIsHost(true);
    }

    await getMeetingAndToken(meetingId);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => setMeetingId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Your Name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => onClick(false)}>Join</button>
      {" or "}
      <button onClick={() => onClick(true)}>Join as Host</button>
      {" or "}
      <button onClick={() => onClick(true)}>Create Meeting</button>
    </div>
  );
}


function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  const { join } = useMeeting();
  const { rooms } = useBreakoutRooms();
  const { participants, changeWebcam, localParticipant } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  const getLocalParticipantBreakoutRoom = () => {
    // Find the room object where the local participant is present
    const room = rooms.find((room) =>
      room.participants.includes(localParticipant.id)
    );

    return room; // Return the room object or undefined if not found
  };

  const localRoom = getLocalParticipantBreakoutRoom(); // Get the breakout room object for the local participant

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined === "JOINED" ? (
        <div>
          <Controls isHost={props.isHost} />

          {rooms.length > 0 && localRoom ? (
            /* Rendering only participants in the current breakout room */
            <div key={localRoom.id}>
              <h4>{localRoom.name}</h4>
              {[...participants.keys()].map((participantId)=>{
                return localRoom.participants.includes(participantId) ? <ParticipantView
                participantId={participantId}
                key={participantId}
                generalGrid={false}
              />: <InvisibleParticipants participantId={participantId}/>
              })}
              {/* {localRoom.participants.map((participantId) => (
                <ParticipantView
                  participantId={participantId}
                  key={participantId}
                  generalGrid={false}
                />
              ))} */}
            </div>
          ) : (
            Array.from(participants.keys())
              .filter((participantId) => {
                // Check if participant is not in any breakout room
                const isInBreakoutRoom = rooms.some((room) =>
                  room.participants.includes(participantId)
                );
                return !isInBreakoutRoom;
              })
              .map((participantId) => (
                <ParticipantView
                  participantId={participantId}
                  key={participantId}
                  isHost={props.isHost}
                  generalGrid={true}
                />
              ))
          )}
        </div>
      ) : joined && joined === "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}


function App() {
  const [meetingId, setMeetingId] = useState(null);
  const [participantName, setParticipantName] = useState("Test");
  const [isHost, setIsHost] = useState(false);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
  };



  return (

    authToken && meetingId ? (
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: true,
          name: participantName,
          metaData: {
            isHost: isHost,
          },
        }}
        token={authToken}
      >
        <BreakoutRoomsProvider>
          {/* Main meeting route */}

          <MeetingConsumer>
            {() => (
              <MeetingView
                meetingId={meetingId}
                onMeetingLeave={onMeetingLeave}
                isHost={isHost}
                setIsHost={setIsHost}
              />
            )}
          </MeetingConsumer>

        </BreakoutRoomsProvider>

      </MeetingProvider>
    ) : (
      <JoinScreen getMeetingAndToken={getMeetingAndToken} setIsHost={setIsHost} setParticipantName={setParticipantName} />
    )
  );
}

export default App;
