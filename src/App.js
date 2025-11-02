import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("https://chat-server-clfc.onrender.com");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", { text: message, type: "text" });
    setMessage("");
  };

  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    socket.emit("send_message", { text: data.filePath, type: "image" });
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>💬 Chat Online de Fer</h2>

      <div style={{
        border: "1px solid gray",
        width: "60%",
        margin: "0 auto",
        padding: 10,
        height: 400,
        overflowY: "auto"
      }}>
        {chat.map((msg, i) => (
          msg.type === "image"
            ? <img key={i} src={msg.text} alt="uploaded" width="200" style={{ margin: 5 }} />
            : <p key={i}>{msg.text}</p>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setShowPicker(!showPicker)}>😀</button>
        {showPicker && (
          <EmojiPicker onEmojiClick={(emoji) => setMessage(message + emoji.emoji)} />
        )}

        <input
          style={{ width: "40%", margin: "0 5px" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
        <input type="file" onChange={handleFileUpload} />
      </div>
    </div>
  );
}

export default App;
