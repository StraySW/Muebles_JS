import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';

export interface UserSession {
  id?: string;
  cc?: string;
  nombre: string;
  apellido?: string;
  email: string;
  rol?: string;
  edad?: number;
  sexo?: string;
  telefono?: string;
  direccion?: string;
}

interface LoginResponse {
  mensaje: string;
  usuario: UserSession;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth';

  readonly currentUser = signal<UserSession | null>(this.getInitialUser());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  private getInitialUser(): UserSession | null {
    if (!this.isBrowser) return null;
    const stored = localStorage.getItem('usuario_sesion');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserSession;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res && res.usuario) {
          this.currentUser.set(res.usuario);
          if (this.isBrowser) {
            localStorage.setItem('usuario_sesion', JSON.stringify(res.usuario));
          }
        }
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catchError((_err) => {
        return of({ success: false, message: 'Credenciales inválidas o error de conexión' });
      }),
      tap((res) => {
        if ('usuario' in res) {
          // Éxito
        }
      })
    ) as unknown as Observable<{ success: boolean; message: string }>;
  }

  establecerUsuario(user: UserSession): void {
    this.currentUser.set(user);
    if (this.isBrowser) {
      localStorage.setItem('usuario_sesion', JSON.stringify(user));
    }
  }

  registro(user: UserSession): boolean {
    const newUser: UserSession = {
      ...user,
      id: crypto.randomUUID ? crypto.randomUUID() : 'USR-' + Date.now(),
      rol: 'CLIENTE',
    };
    this.establecerUsuario(newUser);
    return true;
  }

  updateProfile(data: Partial<UserSession>): void {
    const current = this.currentUser();
    if (!current) return;
    const updated: UserSession = { ...current, ...data };
    this.currentUser.set(updated);
    if (this.isBrowser) {
      localStorage.setItem('usuario_sesion', JSON.stringify(updated));
    }
  }

  logout(): void {
    this.currentUser.set(null);
    if (this.isBrowser) {
      localStorage.removeItem('usuario_sesion');
    }
    this.router.navigate(['/inicio']);
  }
}
