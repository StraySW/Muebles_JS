import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type { Producto, ProductoInput } from '../modelos/catalogo.model';
import { API_BASE_URL } from './api-url.generated';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = `${API_BASE_URL}/catalogo`;

	obtenerCatalogo(categoria?: string): Observable<Producto[]> {
		const url = categoria
			? `${this.apiUrl}?categoria=${encodeURIComponent(categoria)}`
			: this.apiUrl;
		return this.http.get<Producto[]>(url).pipe(
			tap({
				next: (res) => console.log('GET /api/v1/catalogo:', res),
				error: (err) => console.error('Error GET /api/v1/catalogo:', err),
			}),
		);
	}
}