import { useState } from "react";

function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!fullName.trim() || !email.trim()) {
      setMessage("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5004/api/people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setMessage("Person added successfully.");
      setFullName("");
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to server.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Person Registration</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.input}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Add Person
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4"
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "400px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px"
  },
  button: {
    padding: "10px",
    cursor: "pointer"
  },
  message: {
    marginTop: "10px"
  }
};

export default Home;    