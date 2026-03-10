import { useEffect, useState } from "react";
import {
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";

export default function VideoRoom({ appId, channel, token, uid }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(camOn);

  useJoin(
    {
      appid: appId,
      channel,
      token,
      uid,
    },
    true
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Interview Room</h2>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local */}
        <div className="bg-black rounded-2xl overflow-hidden h-72 flex items-center justify-center">
          {localCameraTrack ? (
            <VideoPlayer track={localCameraTrack} />
          ) : (
            <p className="text-white">Camera Off</p>
          )}
        </div>

        {/* Remote */}
        {remoteUsers.map((u) => (
          <div
            key={u.uid}
            className="bg-black rounded-2xl overflow-hidden h-72 flex items-center justify-center"
          >
            {u.videoTrack ? (
              <VideoPlayer track={u.videoTrack} />
            ) : (
              <p className="text-white">User Joined (No Video)</p>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setMicOn((p) => !p)}
          className={`px-4 py-2 rounded-xl text-white ${
            micOn ? "bg-black" : "bg-red-600"
          }`}
        >
          {micOn ? "Mic On" : "Mic Off"}
        </button>

        <button
          onClick={() => setCamOn((p) => !p)}
          className={`px-4 py-2 rounded-xl text-white ${
            camOn ? "bg-black" : "bg-red-600"
          }`}
        >
          {camOn ? "Camera On" : "Camera Off"}
        </button>

        <button
          onClick={() => window.location.href = "/student/interviews"}
          className="px-4 py-2 rounded-xl border"
        >
          Leave
        </button>
      </div>
    </div>
  );
}

function VideoPlayer({ track }) {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref || !track) return;
    track.play(ref);

    return () => {
      track.stop();
    };
  }, [ref, track]);

  return <div ref={setRef} className="w-full h-full" />;
}