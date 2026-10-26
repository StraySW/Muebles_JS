import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  email = '';
  password = '';
  mensaje = '';
  esError = false;
  cargando = false;

  iniciarSesion() {
    if (!this.email || !this.password) {
      this.mensaje = 'Por favor ingresa tu correo y contraseña.';
      this.esError = true;
      return;
    }

    this.cargando = true;
    this.mensaje = 'Verificando credenciales...';
    this.esError = false;

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.cargando = false;
        if (res && res.usuario) {
          this.esError = false;
          this.mensaje = `¡Bienvenido, ${res.usuario.nombre}! Redirigiendo...`;
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 800);
        } else {
          this.esError = true;
          this.mensaje = res.message || 'Credenciales incorrectas o usuario no encontrado.';
        }
      },
      error: () => {
        this.cargando = false;
        this.esError = true;
        this.mensaje = 'Error al conectar con el servidor de autenticación.';
      },
    });
  }
}
