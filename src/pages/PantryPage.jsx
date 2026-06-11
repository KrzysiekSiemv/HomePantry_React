import { useState, useMemo } from 'react';
import { Row, Col, Form, InputGroup, Alert, Badge } from 'react-bootstrap';
import { usePantry } from '../context/PantryContext';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
    'all', 'Nabiał', 'Pieczywo', 'Mięso i wędliny', 'Warzywa i owoce', 'Napoje', 'Inne'
];

export default function PantryPage(){
    const { products } = usePantry();
    const [search, setSearch] = new useState('');
    const [category, setCategory] = new useState('all');

    const filtered = useMemo(() => {
        return products
            .filter(p => category === 'all' || p.category === category)
            .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }, [products, search, category]);

    const expiredCount = useMemo(
        () => products.filter(p => new Date(p.expiry) < new Date()).length,
        [products]
    );

    return (
        <div>
            <h2 className='mb-4'>🏠 Spiżarnia <Badge bg="secondary">{products.length}</Badge></h2>
            {expiredCount > 0 && (
                <Alert variant="warning" className="mb-3">
                    ⚠️ Masz <strong>{expiredCount}</strong> przeterminowanych produktów!
                </Alert>
            )}

            <Row className='g-2 mb-4'>
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>🔍</InputGroup.Text>
                        <Form.Control
                            placeholder='Szukaj produktu...'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c === 'all' ? 'Wszystkie kategorie' : c}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {filtered.length === 0 ? (
                <p className='text-muted text-center py-5'>Brak produktów spełniających kryteria</p>   
            ) : (
                <Row className='g-3'>
                    {filtered.map(p => (
                        <Col key={p.id} xs={12} sm={6} lg={4}>
                            <ProductCard product={p} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}