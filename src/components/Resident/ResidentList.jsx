import { Card, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ResidentList({ residents }) {
  if (!residents || !residents.length) {
    return <p className="text-muted">Ingen beboere oprettet endnu.</p>;
  }

  return (
    <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
      <Card.Body>
        <Card.Title>Beboeroversigt</Card.Title>
        <ListGroup>
          {residents.map((r) => (
            <ListGroup.Item key={r.id} className="d-flex justify-content-between">
              <div>
                <strong>{r.fullName}</strong>
                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                  CPR: {r.cpr}
                </div>
                <div style={{ maxWidth: "500px" }} className="text-truncate">
                  Afdeling: {r.department}
                </div>
              </div>
              <Button variant="primary" as={Link} to={`/resident/${r.id}`}>
                Åbn
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}