import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  registroForm: FormGroup = this.fb.group({
    cc: ['', [Validators.required, Validators.pattern(/^[0-9]{6,12}$/)]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  cargando = false;

  get cc() {
    return this.registroForm.get('cc');
  }

  get nombre() {
    return this.registroForm.get('nombre');
  }

  get apellido() {
    return this.registroForm.get('apellido');
  }

  get email() {
    return this.registroForm.get('email');
  }

  get telefono() {
    return this.registroForm.get('telefono');
  }

  get password() {
    return this.registroForm.get('password');
  }

  registrarse(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos correctamente.',
        confirmButtonColor: '#075b3c',
      });
      return;
    }

    const { cc, nombre, apellido, email, telefono, password } = this.registroForm.value;
    this.cargando = true;

    Swal.fire({
      title: 'Creando cuenta...',
      text: 'Registrando tus datos en Muebles JS',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      this.authService.registro({
        nombre,
        apellido,
        email,
      });

      this.cargando = false;
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido, ${nombre}!`,
        text: 'Tu cuenta ha sido creada exitosamente.',
        timer: 1600,
        showConfirmButton: false,
      }).then(() => {
        this.router.navigate(['/inicio']);
      });
    } catch (error) {
      this.cargando = false;
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'No se pudo completar el registro. Intenta nuevamente.',
        confirmButtonColor: '#075b3c',
      });
    }
  }
}
