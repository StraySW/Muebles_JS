import { Component, OnInit, inject } from '@angular/core';
import { Table, type TableColumn } from '../../componentes/table/table';
import type { Cliente } from '../../modelos/cliente.model';
import { ClientesService } from '../../servicios/clientes.service';

@Component({
  selector: 'app-clientes',
  imports: [Table],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  private readonly clientesService = inject(ClientesService);

  clientes: Cliente[] = [];
  clienteColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'edad', label: 'Edad' },
    { key: 'sexo', label: 'Sexo' },
    { key: 'email', label: 'Email' },
    {
      key: 'fecha_creacion',
      label: 'Fecha Creación',
      formatter: (value: unknown) => {
        if (!value) return 'N/A';
        const date = new Date(String(value));
        return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('es-ES');
      },
    },
  ];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cargando = false;
      },
      error: (error: unknown) => {
        console.error('Error al consultar los clientes:', error);
        this.error = 'No fue posible cargar los clientes.';
        this.cargando = false;
      },
    });
  }
}
