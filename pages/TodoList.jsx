import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import taskService from "../service/task_service";
import {
  FAB,
  TextInput,
  Button,
  Dialog,
  Portal,
  PaperProvider,
  IconButton
} from "react-native-paper";

export default function TodoList() {
  const [data, setData] = useState([{entry_id:1234345, data:{ id: 1, name: "Task 1" }}]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null); // Estado para la tarea actual

  const fetchData = async () => {
    try {
      let tasks = await taskService.getTasks();
      setData(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const addItem = async (name) => {
    const newItem = {
      id: data.length + 1,
      name
    };

    await taskService.addTask(newItem); // Llama al servicio para agregar la tarea
    fetchData(); // Vuelve a obtener los datos después de agregar la tarea

  };

  const editItem =  async (id, newName) => {
    const updatedItem = data.find((item) => item.entry_id === id);
    updatedItem.data.name = newName; // Actualiza el nombre de la tarea
    await taskService.updateTask(updatedItem.data, updatedItem.entry_id); // Llama al servicio para actualizar la tarea
    setData((prevData) =>
      prevData.map((item) =>
        item.entry_id === id ? { ...item, name: newName } : item
      )
    );
  };

  const deleteItem = (id) => {

    taskService.deleteTask(id); // Llama al servicio para eliminar la tarea

    // Actualiza el estado local después de eliminar la tarea
    const newData = data.filter((item) => item.entry_id !== id);
    setData(() => [...newData]);
  };

  const openEditDialog = (task) => {
    setCurrentTask(task); // Establece la tarea actual para editar
    setDialogVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.data.name}</Text>
      <View style={{ flexDirection: "row" }}>
        <IconButton
          icon="clipboard-edit-outline"
          iconColor={"#6200ee"}
          size={20}
          onPress={() => openEditDialog(item)}
        />
        <IconButton
          icon="trash-can-outline"
          iconColor={"red"}
          size={20}
          onPress={() => deleteItem(item.entry_id)}
        />
      </View>
    </View>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.entry_id.toString()}
            contentContainerStyle={{ padding: 16 }}
          />
          <FAB
            style={styles.fab}
            icon="plus"
            color="white"
            onPress={() => {
              setCurrentTask(null); // Limpia la tarea actual para agregar
              setDialogVisible(true);
            }}
          />
          <MyDialogWithForm
            visible={dialogVisible}
            onClose={() => setDialogVisible(false)}
            onAddItem={addItem}
            onEditItem={editItem}
            task={currentTask} // Pasa la tarea actual al modal
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const MyDialogWithForm = ({
  visible,
  onClose,
  onAddItem,
  onEditItem,
  task
}) => {
  const [name, setName] = useState(task ? task.name : ""); // Inicializa con el nombre de la tarea si existe

  const handleAdd = () => {
    if (name.trim()) {
      onAddItem(name);
      setName("");
      onClose();
    }
  };

  const handleEdit = () => {
    if (name.trim() && task) {
      onEditItem(task.entry_id, name);
      setName("");
      onClose();
    }
  };

  React.useEffect(() => {
    if (task) {
      setName(task.name); // Actualiza el nombre si se pasa una tarea
    } else {
      setName(""); // Limpia el nombre si no hay tarea
    }
  }, [task]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>{task ? "Editar Tarea" : "Agregar Tarea"}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nombre de la tarea"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Cancelar</Button>
          {task ? (
            <Button onPress={handleEdit}>Actualizar</Button>
          ) : (
            <Button onPress={handleAdd}>Agregar</Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 5
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee"
  },
  input: {
    marginBottom: 10
  }
});
