import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type { Cliente, ClienteInput } from '../modelos/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClientesService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:3000/api/v1/clientes';

	obtenerTodos(): Observable<Cliente[]> {
		return this.registrarRespuesta(
			'GET /api/v1/clientes',
			this.http.get<Cliente[]>(this.apiUrl),
		);
	}

	obtenerPorId(id: number): Observable<Cliente> {
		return this.registrarRespuesta(
			`GET /api/v1/clientes/${id}`,
			this.http.get<Cliente>(`${this.apiUrl}/${id}`),
		);
	}

	crear(cliente: ClienteInput): Observable<Cliente> {
		return this.registrarRespuesta(
			'POST /api/v1/clientes',
			this.http.post<Cliente>(this.apiUrl, cliente),
		);
	}

	actualizar(id: number, cliente: ClienteInput): Observable<Cliente> {
		return this.registrarRespuesta(
			`PUT /api/v1/clientes/${id}`,
			this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente),
		);
	}

	eliminar(id: number): Observable<void> {
		return this.registrarRespuesta(
			`DELETE /api/v1/clientes/${id}`,
			this.http.delete<void>(`${this.apiUrl}/${id}`),
		);
	}

	private registrarRespuesta<T>(
		ruta: string,
		request: Observable<T>,
	): Observable<T> {
		return request.pipe(
			tap({
				next: (respuesta) => console.log(`${ruta}:`, respuesta),
				error: (error: unknown) => console.error(`${ruta}:`, error),
			}),
		);
	}
}