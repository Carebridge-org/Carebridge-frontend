import { useState } from "react";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        // Tjek password match
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            const res = await fetch("http://localhost:7070/auth/register", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            // Gem token og user i localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Naviger til forsiden (eller dashboard)
            navigate("/");
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card style={{ maxWidth: "400px", width: "100%" }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Register</h3>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Confirm password"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Register
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
