import React from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  useSafeArea?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ children, style, useSafeArea = true }) => {
  const { theme, isDark } = useTheme();

  const content = (
    <View style={[styles.innerContainer, { backgroundColor: theme.background }, style]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      {children}
    </View>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
});
export default Container;
