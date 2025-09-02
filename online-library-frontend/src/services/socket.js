export const connectSocket = (token) => {
  if (!token) {
    console.error("❌ Token missing, cannot connect WebSocket");
    return null;
  }

  const socketUrl = `ws://localhost:8081/ws/notifications?token=${token}`;
  console.log("🔌 Connecting to WebSocket:", socketUrl);

  const socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("📩 Backend se raw data:", event.data);

    try {
      const parsed = JSON.parse(event.data);
      console.log("✅ Parsed JSON:", parsed);
    } catch (err) {
      console.error("❌ JSON parse error:", err);
    }
  };

  socket.onerror = (error) => {
    console.error("⚠️ WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.warn("🔌 WebSocket closed:", event.code, event.reason);
  };

  return socket;
};
