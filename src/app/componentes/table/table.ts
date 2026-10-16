import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  formatter?: (value: unknown, row: Record<string, unknown>) => string | number | null | undefined;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './table.css',
  templateUrl: './table.html',
})
export class Table implements OnChanges {
  @Input() dataSource: unknown[] = [];
  @Input() columns: TableColumn[] = [
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

  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] || changes['dataSource']) {
      this.displayedColumns = this.columns.map((column) => column.key);
    }
  }

  trackByRow = (_index: number, row: unknown): string | number => {
    const record = row as Record<string, unknown>;
    const rowId = record['id'];

    if (typeof rowId === 'string' || typeof rowId === 'number') {
      return rowId;
    }

    return _index;
  };

  formatCell(row: unknown, column: TableColumn): string {
    const record = row as Record<string, unknown>;
    const value = record[column.key];
    const result = column.formatter ? column.formatter(value, record) : value;

    if (typeof result === 'string' || typeof result === 'number') {
      return String(result);
    }

    return result == null ? 'N/A' : String(result);
  }
}
