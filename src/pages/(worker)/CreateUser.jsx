import { useState } from "react";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";

export default function CreateUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [displayEmail, setDisplayEmail] = useState("");
    const [displayPhone, setDisplayPhone] = useState("");
    const [internalEmail, setInternalEmail] = useState("");
    const [internalPhone, setInternalPhone] = useState("");
    const [role, setRole] = useState("CAREWORKER"); // default role
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleDownload = (data, filename = "user.json") => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem("token"); // hent token fra localStorage
        if (!token) {
            setError("Not authenticated");
            return;
        }

        try {
            const body = {
                username,
                password,
                displayName,
                displayEmail,
                displayPhone,
                internalEmail,
                internalPhone,
                role
            };

            const res = await fetch("http://localhost:7070/users", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create user");
                return;
            }

            setSuccess(true);


            // Download JSON fil med brugerdata
            handleDownload(body, `${username}_user.json`);

            // Reset form (optional)
            setUsername("");
            setPassword("");
            setDisplayName("");
            setDisplayEmail("");
            setDisplayPhone("");
            setInternalEmail("");
            setInternalPhone("");
            setRole("CAREWORKER");

        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <Container className="mt-4">
            <Card className="mx-auto" style={{ maxWidth: "600px" }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Create User</h3>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">User created successfully!</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Display Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Display Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={displayEmail}
                                onChange={(e) => setDisplayEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Display Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={displayPhone}
                                onChange={(e) => setDisplayPhone(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Internal Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={internalEmail}
                                onChange={(e) => setInternalEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Internal Phone</Form.Label>
                            <Form.Control
                                type="text"
                                value={internalPhone}
                                onChange={(e) => setInternalPhone(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="ADMIN">Admin</option>
                                <option value="CAREWORKER">Care Worker</option>
                                <option value="GUARDIAN">Guardian</option>
                                <option value="RESIDENT">Resident</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Create User
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
