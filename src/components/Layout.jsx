import { Outlet, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { usePantry } from "../context/PantryContext";

export default function Layout(){
    const { products } = usePantry();
    const expiredCount = products.filter(p => new Date(p.expiry) < new Date()).length;

    return (
        <>
            <Navbar bg="success" variant="dark" expand="lg" sticky="top">
                <Container>
                    <Navbar.Brand>🏠 Domowa Spiżarnia</Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-nav" />
                    <Navbar.Collapse id="main-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/pantry">Spiżarnia</Nav.Link>
                            <Nav.Link as={NavLink} to="/add">➕ Dodaj</Nav.Link>
                            <Nav.Link as={NavLink} to="/categories">Kategorie</Nav.Link>
                            <Nav.Link as={NavLink} to="/settings">Ustawienia</Nav.Link>
                        </Nav>
                        <Nav>
                            {expiredCount > 0 && (
                                <Navbar.Text className="text-warning">
                                    ⚠️ <Badge bg="warning" text="dark">{expiredCount}</Badge> przeterminowanych
                                </Navbar.Text>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="py-4">
                <Outlet />
            </Container>
        </>
    );
}