import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  cargando = false;

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor ingresa un correo válido y tu contraseña.',
        confirmButtonColor: '#075b3c',
      });
      return;
    }

    const { email, password } = this.loginForm.value;
    this.cargando = true;

    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Verificando credenciales en el servidor',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        this.cargando = false;
        if (res && res.usuario) {
          Swal.fire({
            icon: 'success',
            title: `¡Bienvenido, ${res.usuario.nombre}!`,
            text: 'Has iniciado sesión correctamente.',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/inicio']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: res.message || 'El correo o la contraseña son incorrectos.',
            confirmButtonColor: '#075b3c',
          });
        }
      },
      error: (err: any) => {
        this.cargando = false;
        const msg = err?.error?.message || 'Error al conectar con el servidor de autenticación.';
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: msg,
          confirmButtonColor: '#075b3c',
        });
      },
    });
  }
}
