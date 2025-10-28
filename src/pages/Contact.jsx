import { Form, Button } from 'react-bootstrap'

export default function Contact() {
    return (
        <div>
            <h1>📞 Kontakt os</h1>
            <Form className="mt-3" style={{ maxWidth: 400 }}>
                <Form.Group className="mb-3">
                    <Form.Label>Navn</Form.Label>
                    <Form.Control type="text" placeholder="Indtast dit navn" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Indtast din email" />
                </Form.Group>
                <Button variant="success" type="submit">Send</Button>
            </Form>
        </div>
    )
}
