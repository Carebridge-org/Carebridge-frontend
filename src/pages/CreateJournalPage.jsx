import { useEffect, useState } from "react";
import JournalForm from "../components/Journal/JournalForm";
import api from "../services/api";

export default function CreateJournalPage({ addJournal }) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Opret journalindgang</h1>
      <JournalForm addJournal={addJournal} residents={residents} />
    </div>
  );
}