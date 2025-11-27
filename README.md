# VideoSDK Breakout Rooms

[![Documentation](https://img.shields.io/badge/Read-Documentation-blue)](https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/concept-and-architecture)
[![Discord](https://img.shields.io/discord/876774498798551130?label=Join%20on%20Discord)](https://discord.gg/kgAvyxtTxv)
[![Register](https://img.shields.io/badge/Contact-Know%20More-blue)](https://app.videosdk.live/signup)

## Overview

A React implementation of breakout rooms for VideoSDK meetings. This project demonstrates how to create virtual breakout rooms within a single VideoSDK meeting - without creating separate sessions or meetings.

### Key Features

- Create multiple breakout rooms within a single meeting
- Assign participants to specific rooms
- Allow participants to request to join rooms
- Host controls for managing all rooms
- Seamless audio/video isolation between rooms
- No additional VideoSDK meetings required

## How It Works

Unlike traditional implementations that create separate meeting sessions, this breakout room solution works by:

1. Using a single VideoSDK meeting for all participants
2. Managing room membership through client-side state (via PubSub)
3. Selectively pausing/resuming media streams based on room membership
4. Conditionally rendering participants based on which room they're in

This approach is efficient, scalable, and provides a seamless experience for all participants.

## Setup Guide

### Prerequisites

- React Js 16 or later
- Node 10 or later
- Valid [VideoSDK Account](https://app.videosdk.live/signup)

### Installation

1. Clone the repository

```bash
git clone https://github.com/videosdk-community/breakout-rooms.git
cd breakout-rooms
```

2. Install dependencies

```bash
npm install
```

3. Update the `src/API.js` file with your VideoSDK authentication token

   - Sign up or log in to the [VideoSDK Dashboard](https://app.videosdk.live/api-keys)
   - Navigate to the API Keys section
   - Generate a token or use an existing one
   - Create a `.env` file in the root directory and add:

   ```
   REACT_APP_VIDEOSDK_AUTH_TOKEN=your_token_here
   ```

   - Alternatively, you can directly update the token in `src/API.js`

4. Start the application

```bash
npm start
```

## Usage Guide

### Host Controls

As a meeting host, you can:

- Create new breakout rooms with custom names
- Invite participants to specific rooms
- Remove participants from rooms
- Delete breakout rooms
- Accept/reject room join requests from participants

### Participant Controls

As a meeting participant, you can:

- View available breakout rooms
- Request to join specific rooms
- Leave a breakout room to return to main meeting

## Architecture

This implementation uses three main components:

1. **BreakoutRoomsContext**: Manages room state and PubSub communication
2. **ParticipantView/InvisibleParticipants**: Controls media stream rendering
3. **Controls**: Provides the user interface for room management

### PubSub Message Types

The system uses these PubSub message types to coordinate room state:

- `addRoom`: Creates a new breakout room
- `addParticipant`: Assigns a participant to a room
- `removeParticipant`: Removes a participant from a room
- `deleteRoom`: Removes a breakout room

## Customization

### Styling

The UI components use inline styles for easy customization. Modify the `styles` object in `Controls.js` to change the appearance of buttons, dropdowns, and other UI elements.

### Room Management Logic

To customize how rooms are created or managed, modify the functions in `BreakoutRoomsContext.js` and the message handling in `onMessageReceived`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

- [VideoSDK Documentation](https://docs.videosdk.live/)
- [VideoSDK React SDK Reference](https://docs.videosdk.live/react/api/sdk-reference/setup)
- [VideoSDK PubSub Guide](https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/collaboration-using-pubsub)

---

Built with ❤️ using [VideoSDK](https://videosdk.live)
