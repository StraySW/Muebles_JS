import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import type { Cliente } from '../../modelos/cliente.model';
import { ClientesService } from '../../servicios/clientes.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes = signal<Cliente[]>([]);

  private readonly clientesService = inject(ClientesService);

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes.set(data);
      },
      error: (err) => console.error('Error al obtener clientes:', err),
    });
  }
}
