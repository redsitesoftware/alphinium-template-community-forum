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

## Architecture
- `src/store/forumStore.js`
- `src/navigation/AppNavigator.js`
- `src/screens/HomeScreen.js`
- `src/screens/ThreadScreen.js`
- `src/screens/NewPostScreen.js`
- `src/screens/ProfileScreen.js`
