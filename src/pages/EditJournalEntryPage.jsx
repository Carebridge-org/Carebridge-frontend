import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import JournalForm from "../components/Journal/JournalForm";
import { getJournalEntry } from "../api/api";

export default function EditJournalEntryPage() {
  const { journalId, entryId } = useParams(); 
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function fetchEntry() {
    try {
      const data = await getJournalEntry(journalId, entryId);

      // Sæt alle felter fra backend
      setEntry({
        id: data.id,
        journalId: data.journalId,
        title: data.title,
        type: data.entryType,      
        riskAssessment: data.riskAssessment,
        author: data.authorUserId, 
        content: data.content,
      });

      setLoading(false);
    } catch (err) {
      console.error("Kunne ikke hente journal entry:", err);
      setError("Kunne ikke hente journal entry");
      setLoading(false);
    }
  }
  fetchEntry();
}, [journalId, entryId]);

  if (loading) return <p>Loader...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2>Rediger journalindgang</h2>
      <JournalForm initialData={entry} />
    </div>
  );
}
