import { Card, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function JournalList({ journals }) {
  if (!journals || journals.length === 0)
    return <p className="text-muted">Ingen journaler oprettet endnu.</p>;

  return (
    <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
      <Card.Body>
        <Card.Title>Journaloversigt</Card.Title>
        <ListGroup>
          {journals.map((j) => (
            <ListGroup.Item
              key={j.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div style={{ flex: 1 }}>
                <strong>{j.title}</strong>
                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {j.createdAt}
                </div>
                <div style={{ maxWidth: "500px" }} className="text-truncate">
                  {j.content}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="primary" as={Link} to={`/journal/${j.id}`}>
                  Åbn
                </Button>
                <Button
                  variant="secondary"  
                  as={Link}
                  to={`/journals/${j.journalId}/entries/${j.id}/edit`}
                  >
                  Rediger
                </Button>

              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="mt-3 text-end">
          <Button as={Link} to="/create-journal">
            Opret ny journal
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
