import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ThreadScreen from '../screens/ThreadScreen';
import NewPostScreen from '../screens/NewPostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useForum } from '../store/forumStore';

export default function AppNavigator() {
 const { phase } = useForum();

 switch (phase) {
 case 'thread':
 return <ThreadScreen />;
 case 'new-post':
 return <NewPostScreen />;
 case 'profile':
 return <ProfileScreen />;
 case 'home':
 default:
 return <HomeScreen />;
 }
}
