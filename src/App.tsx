import { useState } from "react";
import "./App.css";


type User = {
  id: number;
  email: string;
  name: string | null;
};

function App() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  const createUser = async () => {
    setError("");
    setCreatedUser(null);

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) {
        const errBody: { message?: string } = await res
          .json()
          .catch(() => ({}));
        throw new Error(errBody.message || "Failed to create user");
      }

      const data: { success: boolean; data: User } = await res.json();
      setCreatedUser(data.data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-blue-500">
        Create User (Prisma + Express)
      </h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="max-w-sm"
      />

      <input
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="max-w-sm"
      />

      <button onClick={createUser}>Save to Database</button>

      {error !== "" && <p className="text-red-500">{error}</p>}

      {createdUser !== null && (
        <p>
          <strong>Created:</strong> {createdUser.id} – {createdUser.email} –{" "}
          {createdUser.name ?? "(no name)"}
        </p>
      )}
    </div>
  );
}

export default App;
