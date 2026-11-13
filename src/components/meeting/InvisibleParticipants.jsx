import React, {
    useEffect,

  } from "react";
  import {
    useParticipant,

  } from "@videosdk.live/react-sdk";

export default function InvisibleParticipants(props){
    const {
      webcamStream,
      micStream,
      
    } = useParticipant(props.participantId);
  
    useEffect(() => {
      webcamStream?.pause();
      micStream?.pause();
    }, [webcamStream, micStream])
  
    return <></>;
  }