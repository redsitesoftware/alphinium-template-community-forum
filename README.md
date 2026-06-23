[![Forge with Alphinium](https://img.shields.io/badge/🔨_Forge_with_Alphinium-Build_Your_Version-6366f1?style=for-the-badge&logo=github)](https://alphinium.com/forge?template=community-forum)

> **This is an Alphinium template.** Click the badge above to fork this project and have an AI agent build your customised version automatically.

---

# Community Forum Demo

Expo + React Native demo forum for alphinium builders.

## Features
- Community home feed with categories and popular threads
- Thread detail with replies, upvotes, and heart reactions
- New post flow with category picker and tags
- Profile screen with stats, badges, and recent posts
- State-driven navigation using a React context reducer

## Run locally
```bash
npm install --legacy-peer-deps
npx expo install react-dom react-native-web @expo/metro-runtime
CI=1 npx expo start --web --port 8092 --clear
```

## Configuration

| Variable | Description | Default | Notes |
|---|---|---|---|
| `EXPO_PUBLIC_GA_ID` | GA4 Measurement ID | `G-X09N3J8X17` | Override with your own GA property when going live |

Copy `.env.example` to `.env` and adjust values as needed.

## Architecture
- `src/store/forumStore.js`
- `src/navigation/AppNavigator.js`
- `src/screens/HomeScreen.js`
- `src/screens/ThreadScreen.js`
- `src/screens/NewPostScreen.js`
- `src/screens/ProfileScreen.js`
