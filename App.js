import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ForumProvider } from './src/store/forumStore';
import { colors } from './src/theme';

export default function App() {
  return (
    <ForumProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <AppNavigator />
      </View>
    </ForumProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
