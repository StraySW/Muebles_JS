import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { Producto } from '../modelos/catalogo.model';

@Injectable({ providedIn: 'root' })
export class ApiMuebles {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:3000/api/v1/catalogo';

	getProductos(): Observable<Producto[]> {
		return this.http.get<Producto[]>(this.apiUrl);
	}
}
