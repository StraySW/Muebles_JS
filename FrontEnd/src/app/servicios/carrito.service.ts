import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type { Carrito, CarritoInput } from '../modelos/carrito.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:3000/api/v1/carrito';

	obtenerTodos(): Observable<Carrito[]> {
		return this.http.get<Carrito[]>(this.apiUrl).pipe(
			tap({
				next: (res) => console.log('GET /api/v1/carrito:', res),
				error: (err) => console.error('Error GET /api/v1/carrito:', err),
			}),
		);
	}

	obtenerPorId(id: number): Observable<Carrito> {
		return this.http.get<Carrito>(`${this.apiUrl}/${id}`);
	}

	obtenerPorCliente(clienteId: number): Observable<Carrito> {
		return this.http.get<Carrito>(`${this.apiUrl}/cliente/${clienteId}`);
	}

	crear(carrito: CarritoInput): Observable<Carrito> {
		return this.http.post<Carrito>(this.apiUrl, carrito);
	}

	actualizar(id: number, carrito: CarritoInput): Observable<Carrito> {
		return this.http.put<Carrito>(`${this.apiUrl}/${id}`, carrito);
	}

	eliminar(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
}
