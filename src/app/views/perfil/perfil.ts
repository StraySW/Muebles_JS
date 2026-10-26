import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  nombre = '';
  apellido = '';
  email = '';
  edad?: number;
  sexo?: string;
  mensaje = '';

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.nombre = user.nombre || '';
    this.apellido = user.apellido || '';
    this.email = user.email || '';
    this.edad = user.edad;
    this.sexo = user.sexo || 'M';
  }

  guardarCambios() {
    this.authService.updateProfile({
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      edad: this.edad ? Number(this.edad) : undefined,
      sexo: this.sexo,
    });
    this.mensaje = '¡Información actualizada correctamente!';
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }

  cerrarSesion() {
    this.authService.logout();
  }
}

