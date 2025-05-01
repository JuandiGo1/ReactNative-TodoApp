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
        const { entry_id, data } = task;
        return {
          entry_id: entry_id,
          data: data

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
  },

  async updateTask(task, id) {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/update/${id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          data: task
        })
      });

      if (res.status === 200) {
        console.log("Task updated success");
      } else {
        const text = await res.text();
        console.error(`updateTask failed ${res.status}:`, text);
        return null;
      }
    } catch (err) {
      console.error("updateTask error:", err);
      return null;
    }
  },

  async deleteTask(taskId) {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/delete/${taskId}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      });

      if (res.status === 200) {
        console.log("Task deleted success");
      } else {
        const text = await res.text();
        console.error(`deleteTask failed ${res.status}:`, text);
        return null;
      }
    } catch (err) {
      console.error("deleteTask error:", err);
      return null;
    }
  }
};

export default taskService;
