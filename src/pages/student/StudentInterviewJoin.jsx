import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import { getInterviewById, getInterviewToken } from "../../services/interviewService";

export default function StudentInterviewJoin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);

  const localPlayerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const [interview, setInterview] = useState(null);
  const [joined, setJoined] = useState(false);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const [remoteUsers, setRemoteUsers] = useState([]);

  // Load interview details
  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getInterviewById(id);
        setInterview(res.interview);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load interview.");
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id]);

  // Setup Agora Client
  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        setRemoteUsers((prev) => [...prev.filter((u) => u.uid !== user.uid), user]);
      }

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    };

    const handleUserUnpublished = (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    const handleUserLeft = (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-left", handleUserLeft);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-left", handleUserLeft);
    };
  }, []);

  // Join interview
  const handleJoin = async () => {
    try {
      setJoining(true);
      setError("");

      const tokenRes = await getInterviewToken(id);
      const { appId, token, channelName, uid } = tokenRes;

      const client = clientRef.current;

      // Join channel
      await client.join(appId, channelName, token, uid || null);

      // Create local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      localAudioTrackRef.current = audioTrack;
      localVideoTrackRef.current = videoTrack;

      // Play local video
      videoTrack.play(localPlayerRef.current);

      // Publish tracks
      await client.publish([audioTrack, videoTrack]);

      setJoined(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to join interview.");
    } finally {
      setJoining(false);
    }
  };

  // Leave interview
  const handleLeave = async () => {
    try {
      const client = clientRef.current;

      localAudioTrackRef.current?.stop();
      localAudioTrackRef.current?.close();

      localVideoTrackRef.current?.stop();
      localVideoTrackRef.current?.close();

      localAudioTrackRef.current = null;
      localVideoTrackRef.current = null;

      setRemoteUsers([]);

      await client.leave();
      setJoined(false);

      navigate("/student/interviews");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMic = async () => {
    const track = localAudioTrackRef.current;
    if (!track) return;

    await track.setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const toggleCam = async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;

    await track.setEnabled(!camOn);
    setCamOn(!camOn);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-600">Loading interview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/student/interviews")}
          className="mt-4 px-4 py-2 rounded-xl bg-black text-white"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Interview Room</h2>
          <p className="text-gray-600 text-sm">
            {interview?.company?.name || "Company"} •{" "}
            {interview?.job?.title || "Role"}
          </p>
        </div>

        {!joined ? (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="px-6 py-2 rounded-xl bg-black text-white disabled:opacity-50"
          >
            {joining ? "Joining..." : "Join Interview"}
          </button>
        ) : (
          <button
            onClick={handleLeave}
            className="px-6 py-2 rounded-xl bg-red-600 text-white"
          >
            Leave
          </button>
        )}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Local Video */}
        <div className="bg-black rounded-2xl overflow-hidden shadow relative h-[320px]">
          <div ref={localPlayerRef} className="w-full h-full" />
          {!joined && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              Preview will appear after joining
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-white/10 text-white text-xs px-3 py-1 rounded-full">
            You
          </div>
        </div>

        {/* Remote Users */}
        {remoteUsers.length === 0 ? (
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 flex items-center justify-center text-gray-600 text-sm h-[320px]">
            Waiting for interviewer to join...
          </div>
        ) : (
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {remoteUsers.map((user) => (
              <RemoteVideo key={user.uid} user={user} />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      {joined && (
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Slot:{" "}
            <span className="font-medium text-gray-900">
              {interview?.slot
                ? new Date(interview.slot).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleMic}
              className={`px-4 py-2 rounded-xl text-sm border ${
                micOn ? "" : "bg-gray-100"
              }`}
            >
              {micOn ? "Mic ON" : "Mic OFF"}
            </button>

            <button
              onClick={toggleCam}
              className={`px-4 py-2 rounded-xl text-sm border ${
                camOn ? "" : "bg-gray-100"
              }`}
            >
              {camOn ? "Cam ON" : "Cam OFF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RemoteVideo({ user }) {
  const ref = useRef(null);

  useEffect(() => {
    if (user.videoTrack && ref.current) {
      user.videoTrack.play(ref.current);
    }
    return () => {
      user.videoTrack?.stop();
    };
  }, [user]);

  return (
    <div className="bg-black rounded-2xl overflow-hidden shadow relative h-[320px]">
      <div ref={ref} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-white/10 text-white text-xs px-3 py-1 rounded-full">
        UID: {user.uid}
      </div>
    </div>
  );
}