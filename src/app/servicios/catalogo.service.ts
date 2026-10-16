import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type { Producto, ProductoInput } from '../modelos/catalogo.model';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:3000/api/v1/catalogo';

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