import { useEffect, useState } from "react";
import JournalForm from "../components/JournalForm";
import { getResidents } from "../api/journalService";

export default function CreateJournalPage({ currentUser }) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResidents() {
      try {
        const data = await getResidents();
        setResidents(data);
      } catch (err) {
        setError(`Kunne ikke hente beboerliste: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchResidents();
  }, []);

  if (loading) return <p>Henter beboerliste...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Opret journalindgang</h1>
      <JournalForm residents={residents} currentUser={currentUser} />
    </div>
  );
}
