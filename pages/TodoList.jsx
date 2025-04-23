import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB } from "react-native-paper";

export default function TodoList() {
  const [data, setData] = useState([{ id: 1, name: "Item 1" }]);
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  );
  const addItem = () => {
    const newItem = {
      id: data.length + 1,
      name: `Item ${data.length + 1}`
    };
    setData((prevData) => [...prevData, newItem]);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
        <FAB style={styles.fab} icon="plus" color="white" onPress={addItem} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 5
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee"
  }
});
