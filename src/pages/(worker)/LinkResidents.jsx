import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

export default function LinkResidents() {
    const [users, setUsers] = useState([]);
    const [guardians, setGuardians] = useState([]);
    const [residents, setResidents] = useState([]);
    const [selectedGuardian, setSelectedGuardian] = useState("");
    const [selectedResidents, setSelectedResidents] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const token = localStorage.getItem("jwt_token");
            
            try {
                // Hent alle brugere
                const usersRes = await fetch("http://localhost:7070/api/users", {
                    headers: { "Authorization": "Bearer " + token }
                });
                
                if (!usersRes.ok) {
                    throw new Error("Kunne ikke hente brugere");
                }
                
                const usersData = await usersRes.json();
                setUsers(usersData);
                
                // Filtrer pårørende og beboere baseret på rolle
                const guardiansFiltered = usersData.filter(u => u.role === "GUARDIAN");
                const residentsFiltered = usersData.filter(u => u.role === "RESIDENT");
                
                setGuardians(guardiansFiltered);
                setResidents(residentsFiltered);
                
            } catch (err) {
                setError(err.message || "Kunne ikke indlæse data");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(null);

        const token = localStorage.getItem("jwt_token");
        if (!token) return setError("Du er ikke logget ind");

        try {
            const res = await fetch(`http://localhost:7070/api/users/${selectedGuardian}/link-residents`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": "Bearer " + token 
                },
                body: JSON.stringify({ residentIds: selectedResidents }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.msg || data.error || "Kunne ikke tilknytte beboere");
                return;
            }

            setSuccess(true);
            setSelectedResidents([]);
            setSelectedGuardian("");
        } catch (err) {
            setError("Netværksfejl: " + err.message);
        }
    };

    if (loading) {
        return <div className="text-center p-4"><Spinner animation="border" /></div>;
    }

    return (
        <div className="container mt-4">
            <h2>Tilknyt Beboere til Pårørende</h2>
            
            <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Beboere er tilknyttet!</Alert>}

                <Form.Group className="mb-3">
                    <Form.Label>Vælg Pårørende</Form.Label>
                    <Form.Select 
                        value={selectedGuardian} 
                        onChange={(e) => setSelectedGuardian(e.target.value)} 
                        required
                    >
                        <option value="">-- Vælg en pårørende --</option>
                        {guardians.map(g => (
                            <option key={g.id} value={g.id}>
                                {g.displayName || g.name || g.email} ({g.email})
                            </option>
                        ))}
                    </Form.Select>
                    {guardians.length === 0 && (
                        <Form.Text className="text-muted">
                            Ingen pårørende fundet. Opret først en bruger med GUARDIAN rolle.
                        </Form.Text>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Vælg Beboere at Tilknytte</Form.Label>
                    {residents.length === 0 ? (
                        <Alert variant="info">Ingen beboere fundet. Opret først brugere med RESIDENT rolle.</Alert>
                    ) : (
                        residents.map(r => (
                            <Form.Check
                                type="checkbox"
                                key={r.id}
                                id={`resident-${r.id}`}
                                label={`${r.displayName || r.name} - ${r.displayEmail || r.email}`}
                                value={r.id}
                                checked={selectedResidents.includes(r.id)}
                                onChange={(e) => {
                                    const id = Number(e.target.value);
                                    setSelectedResidents(prev =>
                                        prev.includes(id) 
                                            ? prev.filter(x => x !== id) 
                                            : [...prev, id]
                                    );
                                }}
                            />
                        ))
                    )}
                </Form.Group>

                <Button 
                    type="submit" 
                    variant="primary"
                    disabled={!selectedGuardian || selectedResidents.length === 0}
                >
                    Tilknyt Valgte Beboere
                </Button>
            </Form>

            <hr className="my-4" />
            
            <div className="mt-4">
                <h4>Oversigt over Brugere</h4>
                <p>Total: {users.length} | Pårørende: {guardians.length} | Beboere: {residents.length}</p>
            </div>
        </div>
    );
}