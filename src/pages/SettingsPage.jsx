import { useState, useTransition } from "react";
import { Card, Row, Col, Button, Modal, ProgressBar } from 'react-bootstrap';
import { usePantry } from "../context/PantryContext";
import { useNavigate } from "react-router-dom";

export default function SettingsPage(){
    const { products, removeProducts } = usePantry();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState(null);
    const [isPending, startTransition] = useTransition();

    const handleCalc = () => {
        startTransition(() => {
            const today = new Date();
            setStats({
                total: products.length,
                expired: products.filter(p => new Date(p.expiry) < today).length,
                expiringSoon: products.filter(p => {
                    const d = Math.ceil((new Date(p.expiry) - today) / 86400000);
                    return d >= 0 && d <= 7;
                }).length,
                byCategory: products.reduce((acc, p) => {
                    acc[p.category] = (acc[p.category] || 0) + 1;
                    return acc;
                }, {}),
            })
        })
    };

    const handleClearAll = () => {
        products.forEach(p => removeProducts(p.id));
        setShowModal(false);
        navigate('/pantry');
    }

    return (
        <div>
            <h2 className="mb-4">⚙️ Ustawienia</h2>
            <Card className="mb-4">
                <Card.Header><strong>Statystyki spiżarni</strong></Card.Header>
                <Card.Body>
                    <Button variant="outline-success" onClick={handleCalc} disabled={isPending} className="mb-3">
                        {isPending ? 'Obliczanie...' : '📊 Oblicz statystyki'}
                    </Button>
                    {stats && (
                        <Row className="g-3">
                            <Col xs={6} md={3}>
                                <Card className="text-center border-success">
                                    <Card.Body>
                                        <h3 className="text-success">{stats.total}</h3>
                                        <small>Wszystkich</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={6} md={3}>
                                <Card className="text-center border-danger">
                                    <Card.Body>
                                        <h3 className="text-success">{stats.expired}</h3>
                                        <small>Przeterminowanych</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={6} md={3}>
                                <Card className="text-center border-warning">
                                    <Card.Body>
                                        <h3 className="text-warning">{stats.expiringSoon}</h3>
                                        <small>Kończy się wkrótce</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12}>
                                <h6 className="mt-2">Podział na kategorie:</h6>
                                {Object.entries(stats.byCategory).map(([cat, count]) => (
                                    <div key={cat} className="mb-2">
                                        <div className="d-flex justify-content-between">
                                            <small>{cat}</small>
                                            <small>{count}</small>
                                        </div>
                                        <ProgressBar
                                            now={(count / stats.total) * 100}
                                            variant="success"
                                            style={{ height: '8px' }}
                                        />
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
            <Card className="border-danger">
                <Card.Header className="text-danger"><strong>Strefa niebezpieczna</strong></Card.Header>
                <Card.Body>
                    <p className="text-muted">Usunięcie wszystkich produktów jest nieodwracalne.</p>
                    <Button variant="danger" onClick={() => setShowModal(true)}>🗑️ Wyczyść całą spiżarnię</Button>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Potwierdzenie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Czy na pewno usunąć <strong>wszystkie {products.length} produkty</strong>?
                    Tej operacji nie można cofnąć.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClearAll}>Usuń wszystko</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}