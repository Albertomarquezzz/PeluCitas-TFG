import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ButtonModule,CommonModule, TabViewModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PeluCitas';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}
}