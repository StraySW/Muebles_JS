import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type { Categoria, CategoriaInput } from '../modelos/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:3000/api/v1/categorias';

	obtenerTodas(): Observable<Categoria[]> {
		return this.http.get<Categoria[]>(this.apiUrl).pipe(
			tap({
				next: (res) => console.log('GET /api/v1/categorias:', res),
				error: (err) => console.error('Error GET /api/v1/categorias:', err),
			}),
		);
	}

	obtenerPorId(id: number): Observable<Categoria> {
		return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
	}

	crear(categoria: CategoriaInput): Observable<Categoria> {
		return this.http.post<Categoria>(this.apiUrl, categoria);
	}

	actualizar(id: number, categoria: CategoriaInput): Observable<Categoria> {
		return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
	}

	eliminar(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
}
