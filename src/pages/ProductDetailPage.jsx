import { useParams, useNavigate } from "react-router-dom";
import { Card, Badge, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import { usePantry } from "../context/PantryContext";

function getExpiryStatus(expiry) {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if(diff < 0) return { variant: "danger", label: "Przeterminowany" };
    if(diff <= 3) return { variant: "warning", label: `Kończy się  (${diff}d)`}
    return { variant: "success", label: `OK (${diff}d)` };
}

export default function ProductDetailPage(){
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, removeProduct } = usePantry();

    const product = products.find(p => p.id === Number(id));

    if(!product){
        return (
            <Alert variant="danger">
                Produkt o ID {id} nie istnieje.{' '}<Alert.Link onClick={() => navigate('/pantry')}>Wróć do spiżarni</Alert.Link>
            </Alert>
        )
    }

    const status = getExpiryStatus(product.expiry);

    const handleDelete = () => {
        removeProduct(product.id);
        navigate('/pantry');
    }

    return (
        <div>
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>⬅️ Powrót</Button>

            <Card className="shadow">
                <Card.Header className="bg-success text-white py-3">
                    <h4 className="mb-0">{product.name}</h4>
                </Card.Header>
                <Card.Body>
                    <Alert variant={status.variant} className="mb-3">{status.text}</Alert>
                    <Table bordered hover className="mb-0">
                        <tbody>
                            <tr><th>Kategoria</th><td>{product.category}</td></tr>
                            <tr><th>Ilość</th><td>{product.amount} {product.unit}</td></tr>
                            <tr><th>Data ważności</th><td>{product.expiry}</td></tr>
                            <tr>
                                <th>Status</th>
                                <td>
                                    <Badge bg={product.opened ? 'info' : 'secondary'} text="dark">{product.opened ? 'Otwarty' : 'Zamknięty'}</Badge>
                                </td>
                            </tr>
                            {product.notes && (
                                <tr><th>Uwagi</th><td>{product.notes}</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end">
                    <Button variant="danger" onClick={handleDelete}>🗑️ Usuń produkt</Button>
                </Card.Footer>
            </Card>
        </div>
    );
}