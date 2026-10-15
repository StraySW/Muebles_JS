import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import type { Cliente } from '../../modelos/cliente.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule],
  styleUrl: './table.css',
  templateUrl: './table.html',
})
export class Table {
	@Input() dataSource: Cliente[] = [];
	displayedColumns: string[] = ['id', 'nombre', 'cedula', 'direccion', 'telefono'];
}
