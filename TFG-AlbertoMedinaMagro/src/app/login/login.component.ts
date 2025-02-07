import { Component } from '@angular/core';
import { NgIf } from "@angular/common";
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { MessageService } from 'primeng/api';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  imports: [TabViewModule, ButtonModule, RouterLink, RouterLinkActive, FormsModule, NgIf,NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private messageService: MessageService
  ) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { data, error } = await this.supabaseService.signIn(this.email, this.password);
      
      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error('Correo electrónico o contraseña incorrectos');
        }
        throw error;
      }

      if (data) {
        // Guardar el token en localStorage
        if (data.session) {
          localStorage.setItem('authToken', data.session.access_token);
        }
				// Redirect to home page after successful login
				this.router.navigate(['/inicio']);
			}
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}