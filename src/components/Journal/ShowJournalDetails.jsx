import { useParams, Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getJournalEntry } from "../../api/api";

export default function ShowJournalDetails() {
  const { journalId } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJournal() {
      try {
        const data = await getJournalEntry(journalId, journalId); 
        // hvis entryId og journalId ikke er samme, bruger vi entryId
        // ret evt til getJournalEntry(journalId, entryId)
        
        setJournal({
          id: data.id,
          title: data.title,
          type: data.entryType,
          content: data.content,
          riskAssessment: data.riskAssessment,
          author: data.authorUserId,
          createdAt: data.createdAt,
        });

        setLoading(false);
      } catch (err) {
        setError("Kunne ikke hente journal");
        console.error(err);
        setLoading(false);
      }
    }

    fetchJournal();
  }, [journalId]);

  if (loading) return <p>Loader...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <Card.Body>
        <Card.Title>{journal.title}</Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          {journal.createdAt} | Af: {journal.author || "Ukendt"}
        </Card.Subtitle>

        <Card.Text>
          <strong>Type:</strong> {journal.type || "-"} <br />
          <strong>Risiko:</strong> {journal.riskAssessment || "-"} <br /><br />

          <strong>Indhold:</strong><br />
          {journal.content}
        </Card.Text>

        <Button as={Link} to="/journal-overview">Tilbage</Button>
      </Card.Body>
    </Card>
  );
}
