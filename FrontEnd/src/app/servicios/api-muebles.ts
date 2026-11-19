import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { Producto } from '../modelos/catalogo.model';
import { API_BASE_URL } from './api-url.generated';

@Injectable({ providedIn: 'root' })
export class ApiMuebles {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = `${API_BASE_URL}/catalogo`;

	getProductos(): Observable<Producto[]> {
		return this.http.get<Producto[]>(this.apiUrl);
	}
}
