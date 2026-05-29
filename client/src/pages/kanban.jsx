import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const projectId = 1;

  /* =========================
     LOAD TASKS
  ========================= */
  const loadTasks = async () => {
    const res = await fetch(
      `http://localhost:3000/api/tasks/${projectId}`
    );
    const data = await res.json();
    setTasks(data);
  };

  /* =========================
     ADD TASK
  ========================= */
  const addTask = async () => {
    await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        project_id: projectId,
      }),
    });

    setTitle("");
  };

  /* =========================
     DRAG START
  ========================= */
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("taskId", id);
  };

  /* =========================
     DROP
  ========================= */
  const handleDrop = async (e, status) => {
    const id = e.dataTransfer.getData("taskId");

    await fetch(`http://localhost:3000/api/tasks/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const allowDrop = (e) => e.preventDefault();

  /* =========================
     REAL-TIME SYNC
  ========================= */
  useEffect(() => {
    loadTasks();

    socket.on("task-updated", () => {
      loadTasks();
    });

    return () => socket.off("task-updated");
  }, []);

  /* =========================
     RENDER TASKS
  ========================= */
  const renderColumn = (status) =>
    tasks
      .filter((t) => t.status === status)
      .map((t) => (
        <div
          key={t.id}
          draggable
          onDragStart={(e) => handleDragStart(e, t.id)}
          style={{
            background: "white",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            cursor: "grab",
          }}
        >
          {t.title}
        </div>
      ));

  return (
    <div style={{ padding: 20 }}>
      <h2>Kanban Board 🚀 (Real-time)</h2>

      {/* INPUT */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task..."
      />
      <button onClick={addTask}>Add</button>

      {/* BOARD */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div
          onDrop={(e) => handleDrop(e, "todo")}
          onDragOver={allowDrop}
          style={{ flex: 1, background: "#eee", padding: 10 }}
        >
          <h3>Todo</h3>
          {renderColumn("todo")}
        </div>

        <div
          onDrop={(e) => handleDrop(e, "doing")}
          onDragOver={allowDrop}
          style={{ flex: 1, background: "#eee", padding: 10 }}
        >
          <h3>Doing</h3>
          {renderColumn("doing")}
        </div>

        <div
          onDrop={(e) => handleDrop(e, "done")}
          onDragOver={allowDrop}
          style={{ flex: 1, background: "#eee", padding: 10 }}
        >
          <h3>Done</h3>
          {renderColumn("done")}
        </div>
      </div>
    </div>
  );
}

export default Kanban;