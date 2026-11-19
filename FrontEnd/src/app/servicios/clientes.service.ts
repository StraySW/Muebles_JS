import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { Cliente, ClienteInput } from '../modelos/cliente.model';
import { API_BASE_URL } from './api-url.generated';

@Injectable({ providedIn: 'root' })
export class ClientesService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = `${API_BASE_URL}/clientes`;

	getClientes(): Observable<Cliente[]> {
		return this.http.get<Cliente[]>(this.apiUrl);
	}
}