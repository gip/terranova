'use client'

import { useEffect, useState } from 'react'
import { useWorldAuth } from 'next-world-auth/react'
import {
//   ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react'
import { Room, Track } from 'livekit-client'
// import { EgressClient } from 'livekit-server-sdk'
import '@livekit/components-styles'

// const generateRandomName = () => {
//   const adjectives = ['quick', 'fast', 'smart', 'bright', 'cool', 'amazing', 'super', 'mega', 'ultra', 'epic'];
//   const nouns = ['user', 'player', 'gamer', 'coder', 'dev', 'hero', 'star', 'champ', 'pro', 'master'];
//   const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
//   const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
//   const randomNumber = Math.floor(Math.random() * 1000);
//   return `${randomAdjective}-${randomNoun}-${randomNumber}`;
// };

export default function Page() {
  const { session } = useWorldAuth()
  const room = 'quickstart-room'
  const [token, setToken] = useState(null)
  const [roomInstance] = useState(() => new Room({
    // Optimize video quality for each participant's screen
    adaptiveStream: true,
    // Enable automatic audio/video quality optimization
    dynacast: true,
  }));

  useEffect(() => {
    if(session && session.user) {
      let mounted = true;
      (async () => {
        try {
          const resp = await fetch(`/api/token?room=${room}&username=${session.user.username}`);
          const data = await resp.json();
          if (!mounted) return;
          if (data.token) {
            setToken(data.token)
            await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL || '', data.token)
            await roomInstance.localParticipant.enableCameraAndMicrophone()
            // const egress = new EgressClient(process.env.LIVEKIT_URL || '')
            // const outputs = {
            //   segments: new SegmentedFileOutput({
            //     filenamePrefix: 'my-output',
            //     playlistName: 'my-output.m3u8',
            //     livePlaylistName: 'my-output-live.m3u8',
            //     segmentDuration: 2,
            //     output: {
            //       case: 's3',
            //       value: {
            //         accessKey: '',
            //         secret: '',
            //         bucket: '',
            //         region: '',
            //         forcePathStyle: true,
            //       },
            //     },
            //   }),
            // }
            // await egress.startRoomCompositeEgress(room, outputs)
          }
        } catch (e) {
          console.error(e);
        }
      })();
    
      return () => {
        mounted = false;
        roomInstance.disconnect()
      }
    }
  }, [roomInstance, session]);

  if (token === '') {
    return <div>Getting token...</div>;
  }

  return (<>
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '50dvh' }}>
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        {/* <ControlBar /> */}
      </div>
    </RoomContext.Provider>
    <button onClick={() => {
      roomInstance.disconnect()
      window.location.href = '/'} }>End Call</button>
  </>);
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}