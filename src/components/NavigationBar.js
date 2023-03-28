import React from "react"
import { NavLink } from "react-router-dom"
import { Navbar, Nav, NavItem } from "react-bootstrap"
import { Moralis } from "moralis"
import { useMoralis } from "react-moralis"
import { Button } from "web3-uikit"

const Navigation = () => {
    const { authenticate, isAuthenticated, user } = useMoralis()

    const handleConnect = async () => {
        try {
            await authenticate()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={NavLink} to="/">
                <img
                    src="https://example.com/logo.png"
                    height="30"
                    alt="Logo"
                    className="d-inline-block align-top"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="mr-auto">
                    <NavItem>
                        <Nav.Link as={NavLink} to="/home">
                            Home
                        </Nav.Link>
                    </NavItem>
                    <NavItem>
                        <Nav.Link as={NavLink} to="/about">
                            About
                        </Nav.Link>
                    </NavItem>
                    <NavItem>
                        <Nav.Link as={NavLink} to="/contact">
                            Contact
                        </Nav.Link>
                    </NavItem>
                </Nav>
                <Nav>
                    {isAuthenticated ? (
                        <Nav.Item>
                            <Nav.Link>Hello, {user.attributes.username}!</Nav.Link>
                        </Nav.Item>
                    ) : (
                        <Button onClick={handleConnect} variant="primary">
                            Connect
                        </Button>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Navigation

// import { ConnectButton } from "web3uikit"

// function NavigationBar() {
//     return (
//         <nav
//             style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "10px",
//             }}
//         >
//             <h1 style={{ margin: 0 }}>My App</h1>
//             <div>
//                 <ConnectButton moralisAuth={false} />
//             </div>
//         </nav>
//     )
// }

// export default NavigationBar
