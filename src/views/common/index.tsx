import React from "react";
import "./index.css";

export default function Common() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Inmobiliaria Mendoza</h1>
        <nav className="nav">
          <a href="#">Inicio</a>
          <a href="#">Propiedades</a>
          <a href="#">Nosotros</a>
          <a href="#">Contacto</a>
        </nav>
      </header>

      <main className="main">
        <h2>Propiedades destacadas</h2>
        <div className="cards">
          <div className="card">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Casa moderna"
            />
            <h3>Casa Moderna</h3>
            <p>3 habitaciones · 2 baños · $120,000</p>
          </div>
          <div className="card">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Departamento céntrico"
            />
            <h3>Departamento Céntrico</h3>
            <p>2 habitaciones · 1 baño · $80,000</p>
          </div>
          <div className="card">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Terreno amplio"
            />
            <h3>Terreno Amplio</h3>
            <p>500m² · Excelente ubicación · $50,000</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Inmobiliaria Mendoza. Todos los derechos reservados.</p>
      </footer>
    </div>
  
  );
}