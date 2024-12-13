import { Text, View, StyleSheet } from "react-native";

export default function studActivity() {
  return (
    <View style={styles.container}>
      <Text>Activity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});