const BASE_URL = "http://unidb.openlab.uninorte.edu.co";
//const CONTRACT_KEY = "juandigo1-react-native-to-do";
const CONTRACT_KEY = "edison-react-native-to-do";
const TABLE = "tasks";

const taskService = {
  async getTasks() {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/all?format=json`;
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.status !== 200) {
        throw new Error(`Error code ${response.status}`);
      }

      const decoded = await response.json();
      const rawData = decoded.data || [];
      console.log(rawData);

      const tasks = rawData.map((task) => {
        const { id, name } = task.data;
        return {
          id: id,
          name: name
        };
      });
      console.log("getTasks response:", tasks);

      console.log("getTasks ok");
      return tasks;
    } catch (err) {
      console.error("getTasks error:", err);
      throw err;
    }
  },

  async addTask(task) {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          table_name: TABLE,
          data: task
        })
      });

      if (res.status === 200) {
        console.log("Task added success");
      } else {
        const text = await res.text();
        console.error(`addTask failed ${res.status}:`, text);
        return null;
      }
    } catch (err) {
      console.error("addTask error:", err);
      return null;
    }
  }
};

export default taskService;
