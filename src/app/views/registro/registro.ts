import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  cc = '';
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  telefono = '';
  mensaje = '';
  esError = false;

  registrarse() {
    if (!this.cc || !this.nombre || !this.email || !this.password) {
      this.mensaje = 'Por favor completa todos los campos obligatorios (*).';
      this.esError = true;
      return;
    }

    this.authService.registro({
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
    });

    this.esError = false;
    this.mensaje = '¡Cuenta creada con éxito! Redirigiendo...';

    setTimeout(() => {
      this.router.navigate(['/inicio']);
    }, 800);
  }
}

