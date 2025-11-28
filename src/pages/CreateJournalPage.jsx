import { useEffect, useState } from "react";
import JournalForm from "../components/Journal/JournalForm";
import { getUsers } from "../api/api";

export default function CreateJournalPage({ addJournal }) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers(); // hent authors fra backend
        setResidents(data);
      } catch (err) {
        setError(`Kunne ikke hente beboerliste: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Henter beboerliste...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Opret journalindgang</h1>
      <JournalForm addJournal={addJournal} residents={residents} />
    </div>
  );
}
