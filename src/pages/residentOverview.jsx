// src/pages/residentOverview.jsx
import { Card } from "react-bootstrap";

export default function ResidentOverview() {
  // Hardcoded resident for now
  const resident = {
    fullName: "Anna Hansen",
    cpr: "120394-1234",
    department: "Demensafsnit A, 2. sal",
  };

  return (
    <div>
      <h1 className="mb-4">Resident overview</h1>

      <Card>
        <Card.Body>
          <Card.Title className="mb-3">
            {resident.fullName}
          </Card.Title>

          <div className="mb-2">
            <strong>CPR-no.:</strong> {resident.cpr}
          </div>

          <div className="mb-2">
            <strong>Department:</strong> {resident.department}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
