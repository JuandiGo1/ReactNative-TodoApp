import TodoList from "./pages/TodoList";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <TodoList />
    </SafeAreaProvider>
  );
}
