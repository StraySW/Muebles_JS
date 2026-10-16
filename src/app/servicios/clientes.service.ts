import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import type { Cliente, ClienteInput } from '../modelos/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClientesService {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'http://localhost:3000/api/v1/clientes';

	getClientes(): Observable<Cliente[]> {
		return this.http.get<Cliente[]>(this.apiUrl);
	}
}