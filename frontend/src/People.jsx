import { useEffect, useState } from "react";

function People() {
  const [people, setPeople] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const fetchPeople = async () => {
    const res = await fetch("http://localhost:5004/api/people");
    const data = await res.json();
    setPeople(data);
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:5004/api/people/${id}`, {
      method: "DELETE"
    });

    fetchPeople();
  };

  const handleEdit = (person) => {
    setEditingId(person.id);
    setEditName(person.full_name);
    setEditEmail(person.email);
  };

  const handleUpdate = async (id) => {
    await fetch(`http://localhost:5003/api/people/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        full_name: editName,
        email: editEmail
      })
    });

    setEditingId(null);
    fetchPeople();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>People List</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {people.map((p) => (
            <tr key={p.id}>
              <td>
                {editingId === p.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  p.full_name
                )}
              </td>
              <td>
                {editingId === p.id ? (
                  <input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                ) : (
                  p.email
                )}
              </td>
              <td>
                {editingId === p.id ? (
                  <>
                    <button onClick={() => handleUpdate(p.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default People;