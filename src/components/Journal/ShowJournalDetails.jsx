import { useParams, Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

export default function ShowJournalDetails({ journals }) {
  const { journalId } = useParams();
  const journal = journals.find(j => j.id === Number(journalId));

  if (!journal) return <p>Journalen blev ikke fundet.</p>;

  return (
    <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <Card.Body>
        <Card.Title>{journal.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {journal.createdAt} | Beboer: {journal.resident || "Ukendt"}
        </Card.Subtitle>
        <Card.Text>
          <strong>Type:</strong> {journal.type || "-"} <br />
          <strong>Risikoniveau:</strong> {journal.riskAssessment || "-"} <br />
          <strong>Indhold:</strong> <br />
          {journal.content}
          <Card.Subtitle className="mb-2 text-muted">
          {journal.createdAt} | Af: {journal.author || "Ukendt"}
          </Card.Subtitle>
        </Card.Text>
        <Button as={Link} to="/journal-overview">Tilbage til oversigten</Button>
      </Card.Body>
    </Card>
  );
}
