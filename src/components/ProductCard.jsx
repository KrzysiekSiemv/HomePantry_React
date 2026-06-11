import { useCallback } from "react";
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { usePantry } from "../context/PantryContext";

function getExpiryStatus(expiry) {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if(diff < 0) return { variant: "danger", label: "Przeterminowany" };
    if(diff <= 3) return { variant: "warning", label: `Kończy się  (${diff}d)`}
    return { variant: "success", label: `OK (${diff}d)` };
}

export default function ProductCard({ product }){
    const { removeProduct } = usePantry();
    const navigate = useNavigate();
    const status = getExpiryStatus(product.expiry);
    
    const handleRemove = useCallback(() => {
        removeProduct(product.id);
    }, [product.id, removeProduct]);

    return (
        <Card className="h-100 shadow-sm">
            <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                <strong>{product.name}</strong>
                <Badge bg={status.variant} text={status.variant === 'warning' ? 'dark' : undefined}>
                    {status.label}
                </Badge>
            </Card.Header>
            <Card.Body>
                <p className="mb-1"><small className="text-muted">Kategoria:</small> {product.category}</p>
                <p className="mb-1"><small className="text-muted">Ilość:</small> {product.amount} {product.unit}</p>
                <p className="mb-1"><small className="text-muted">Ważność:</small> {product.expiry}</p>
                {product.opened && <Badge bg='info' text='dark'>Otwarty</Badge>}
                {product.notes && <p className="mt-2 mb-0 text-muted"><small>{product.notes}</small></p>}
            </Card.Body>
            <Card.Footer className="d-flex gap-2">
                <Button variant="outline-success" size="sm" className="flex-grow-1" onClick={() => navigate(`/product/${product.id}`)}>Szczegóły</Button>
                <Button variant="outline-danger" size="sm" onClick={handleRemove}>🗑️</Button>
            </Card.Footer>
        </Card>
    );
}