import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCarritos } from '../modelos/carrito.model';

@Service()
export class ApiMuebles {
	private readonly http = inject(HttpClient);
	private readonly apiUrl = 'https://dummyjson.com/carts';

	getCarts(): Observable<RespuestaCarritos> {
		return this.http.get<RespuestaCarritos>(this.apiUrl);
	}
}
