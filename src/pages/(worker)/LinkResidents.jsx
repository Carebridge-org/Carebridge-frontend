import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function LinkResidents() {
    const [guardians, setGuardians] = useState([]);
    const [residents, setResidents] = useState([]);
    const [selectedGuardian, setSelectedGuardian] = useState("");
    const [selectedResidents, setSelectedResidents] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
    async function loadData() {
        const res1 = await fetch("http://localhost:7070/guardians");
        const guardiansData = await res1.json();
        setGuardians(guardiansData);

        const res2 = await fetch("http://localhost:7070/residents");
        let residentsData = await res2.json();

        // Hvis backend ikke har residents endnu → brug mock data
        if (!Array.isArray(residentsData) || residentsData.length === 0) {
            residentsData = [
                {
                    id: 1,
                    fullName: "Test Resident 1",
                    roomNumber: "A-12",
                    dateOfBirth: "1960-05-14",
                    medicalConditions: ["Diabetes"],
                },
                {
                    id: 2,
                    fullName: "Test Resident 2",
                    roomNumber: "B-04",
                    dateOfBirth: "1975-10-11",
                    medicalConditions: [],
                }
            ];
        }

        setResidents(residentsData);
    }

    loadData();
}, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) return setError("Not authenticated");

        try {
            const res = await fetch(`http://localhost:7070/users/${selectedGuardian}/link-residents`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
                body: JSON.stringify({ residentIds: selectedResidents }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to link residents");
                return;
            }

            setSuccess(true);
            setSelectedResidents([]);
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Residents linked!</Alert>}

            <Form.Group>
                <Form.Label>Guardian</Form.Label>
                <Form.Select value={selectedGuardian} onChange={(e) => setSelectedGuardian(e.target.value)} required>
                    <option value="">Select Guardian</option>
                    {guardians.map(g => <option key={g.id} value={g.id}>{g.username}</option>)}
                </Form.Select>
            </Form.Group>

            <Form.Group>
                <Form.Label>Residents</Form.Label>
                {residents.map(r => (
                    <Form.Check
                        type="checkbox"
                        key={r.id}
                        label={r.fullName || r.roomNumber || ("Resident #" + r.id)}
                        value={r.id}
                        checked={selectedResidents.includes(r.id)}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            setSelectedResidents(prev =>
                                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                            );
                        }}
                    />
                ))}
            </Form.Group>

            <Button type="submit">Link Residents</Button>
        </Form>
    );
}
