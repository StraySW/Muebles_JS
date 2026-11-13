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
  private _dataSource: any[] = [];

  @Input()
  set dataSource(value: any[]) {
    this._dataSource = value || [];
    this.updateColumns();
  }
  get dataSource(): any[] {
    return this._dataSource;
  }

  displayColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.updateColumns();
  }

  private updateColumns(): void {
    if (this._dataSource && this._dataSource.length > 0) {
      this.displayColumns = Object.keys(this._dataSource[0]);
    } else {
      this.displayColumns = [];
    }
  }
}
