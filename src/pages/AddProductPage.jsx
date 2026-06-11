import { useState, useRef, useId, useEffect } from "react";
import { Form, FloatingLabel, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { usePantry } from "../context/PantryContext";

const CATEGORIES = [
    'all', 'Nabiał', 'Pieczywo', 'Mięso i wędliny', 'Warzywa i owoce', 'Napoje', 'Inne'
];

const today = new Date().toISOString().split('T')[0];

export default function AddProductPage(){
    const { addProduct } = usePantry();
    const navigate = useNavigate();
    const nameRef = useRef(null);
    const formId = useId();

    const [form, setForm] = useState(
         { name: "", category: '', amount: '', unit: '', expiry: today, opened: false, notes: '' }
    );

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!form.name.trim()) {
            setError("Należy podać nazwę produktu.");
            return;
        }

        if(!form.category){
            setError("Należy wybrać kategorię.");
            return;
        }

        addProduct(form);
        setSuccess(true);
        setError('');
        setForm({
            name: "", category: '', amount: '', unit: '', expiry: today, opened: false, notes: ''
        });
        setTimeout(() => navigate('/pantry'), 1500);
    };

    return (
        <>
            <div>
                <h2 className="mb-4">➕ Nowy produkt w spiżarni</h2>
                { error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
                { success && <Alert variant="success">Produkt dodany! Przekierowanie...</Alert> }
            </div>
            <Form onSubmit={handleSubmit}>
                <FloatingLabel label="Nazwa produktu *" className="mb-3" controlId={`${formId}-name`}>
                    <Form.Control ref={nameRef} type="text" name="name" value={form.name} onChange={handleChange} placeholder="np. Mleko 3,2%"  />
                </FloatingLabel>
                <Row className="g-2 mb-3">
                    <Col xs={6}>
                        <FloatingLabel label="Ilość" controlId={`${formId}-amount`}>
                            <Form.Control type="number" min="0" step="0.1" name="amount" value={form.amount} onChange={handleChange} placeholder="0" />
                        </FloatingLabel>
                    </Col>
                    <Col xs={6}>
                        <FloatingLabel label="Jednostka" controlId={`${formId}-unit`}>
                            <Form.Select name="unit" value={form.unit} onChange={handleChange}>
                                {['szt.', 'l', 'kg', 'g', 'ml', 'op.'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <FloatingLabel label="Kategoria" controlId={`${formId}-category`} className="mb-3">
                    <Form.Select name="category" value={form.category} onChange={handleChange}>
                        {CATEGORIES.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel label="Data ważności" className="mb-3" controlId={`${formId}-expiry`}>
                    <Form.Control type="date" name="expiry" value={form.expiry} onChange={handleChange} min={today} />
                </FloatingLabel>

                <FloatingLabel label="Uwagi (opcjonalne)" className="mb-3" controlId={`${formId}-notes`}>
                    <Form.Control as="textarea" style={{height: '80px'}} name="notes" value={form.notes} onChange={handleChange} placeholder="np. przechowywać w lodówce" />
                </FloatingLabel>

                <Form.Check 
                    type="switch" id={`${formId}-opened`} label="Produkt otwarty" name="opened" checked={form.opened} onChange={handleChange} className="mb-4"
                    />
                
                <div className="d-flex gap-2">
                    <Button variant="success" type="submit" className="flex-grow-1">Dodaj do spiżarni</Button>
                    <Button variant="outline-secondary" onClick={() => navigate('/pantry')}>Anuluj</Button>
                </div>
            </Form>
        </>
    );
}