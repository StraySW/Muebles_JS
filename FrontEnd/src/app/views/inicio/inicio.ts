import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {}
