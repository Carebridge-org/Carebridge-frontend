import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1 className="display-4 mb-3">404 – Siden blev ikke fundet</h1>
      <p className="lead mb-4">
        Ups! Den side, du leder efter, eksisterer ikke eller er blevet flyttet.
      </p>
      <Button variant="primary" onClick={() => navigate("/")}>
        Gå til forsiden
      </Button>
    </Container>
  );
}
