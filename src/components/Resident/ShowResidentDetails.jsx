import { useParams, Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

export default function ShowResidentDetails({ residents }) {
  const { residentId } = useParams();
  const resident = residents.find((r) => r.id === Number(residentId));

  if (!resident) return <p>Beboeren blev ikke fundet.</p>;

  return (
    <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <Card.Body>
        <Card.Title>{resident.fullName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          CPR: {resident.cpr}
        </Card.Subtitle>

        <Card.Text>
          <strong>Afdeling:</strong> {resident.department || "-"} <br />
          {resident.room && (
            <>
              <strong>Stuenr.:</strong> {resident.room} <br />
            </>
          )}
          {resident.notes && (
            <>
              <strong>Bemærkninger:</strong> <br />
              {resident.notes}
            </>
          )}
        </Card.Text>

        <Button as={Link} to="/resident-overview">
          Tilbage til oversigten
        </Button>
      </Card.Body>
    </Card>
  );
}