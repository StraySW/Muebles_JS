import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  styleUrl: 'generic-table.css',
  templateUrl: 'generic-table.html',
  imports: [CommonModule, MatTableModule],
})
export class GenericTable implements OnChanges {
  @Input() dataSource: any[] = [];
  displayColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataSource && this.dataSource.length > 0) {
      this.displayColumns = Object.keys(this.dataSource[0]);
    } else {
      this.displayColumns = [];
    }
  }
}
