import { useMemo } from "react";

export default function useGetMediaStream(listStream) {
  const mediaStream = useMemo(() => {
    const mediaStream = new MediaStream();
    listStream.forEach((stream) => {
      try {
        if (stream) {
          stream?.getTracks()?.forEach((track) => listStream.addTrack(track));
        }
      } catch (e) {
        console.error(e);
      }
    });
    return mediaStream;
  }, [listStream]);
  return mediaStream;
}
