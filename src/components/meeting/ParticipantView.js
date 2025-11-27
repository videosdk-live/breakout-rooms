import React, { useEffect, useMemo, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { StyleReactPlayer } from "../StyleReactPlayer";

const ParticipantView = (props) => {
  const {
    webcamStream,
    micStream,
    screenShareStream,
    webcamOn,
    screenShareOn,
    micOn,
    isLocal,
    displayName,
  } = useParticipant(props.participantId);

  const micRef = useRef(null);

  useEffect(() => {
    webcamStream?.resume();
    micStream?.resume();
  }, [webcamStream, micStream]);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  const mediaStream = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
  }, [screenShareStream, screenShareOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className="participant-container">
      <p className="participant-info">
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <div className="audio-container">
        <audio ref={micRef} autoPlay muted={isLocal} />
      </div>
      <div className="video-container">
        {webcamOn && (
          <StyleReactPlayer
            playsinline
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={videoStream}
            height={"200px"}
            width={"300px"}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        )}
        {screenShareOn && (
          <ReactPlayer
            playsinline
            playIcon={<></>}
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={mediaStream}
            height={"100%"}
            width={"100%"}
            onError={(err) => {
              console.log(err, "presenter video error");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ParticipantView;