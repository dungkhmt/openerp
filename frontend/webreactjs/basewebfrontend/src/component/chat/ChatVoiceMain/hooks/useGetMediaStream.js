import { useEffect, useMemo } from "react";
import { stopMediaStream } from "../utils/helpers";

export default function useGetMediaStream(listStream) {
  const mediaStream = useMemo(() => {
    return new MediaStream();
  }, []);

  useEffect(() => {
    mediaStream.getTracks().forEach((track) => mediaStream.removeTrack(track));
    listStream.forEach((stream) => {
      try {
        if (stream) {
          stream?.getTracks()?.forEach((track) => mediaStream.addTrack(track));
        }
      } catch (e) {
        console.error(e);
      }
    });
  }, [listStream, mediaStream]);

  useEffect(() => {
    return () => {
      stopMediaStream(mediaStream);
    };
  }, []);

  return mediaStream;
}
