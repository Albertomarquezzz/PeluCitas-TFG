import { Component } from '@angular/core';
import { NgIf } from "@angular/common";
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-register',
	imports: [RouterLink, RouterLinkActive, FormsModule, NgIf, ToastModule, NavbarComponent],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
	providers: [MessageService]
})
export class RegisterComponent {
	email: string = '';
	password: string = '';
	confirmPassword: string = '';
	loading: boolean = false;
	errorMessage: string = '';

	constructor(private supabaseService: SupabaseService, private router: Router, private messageService: MessageService) {}

	async onSubmit(event: Event) {
		event.preventDefault();

		if (this.password !== this.confirmPassword) {
			this.errorMessage = 'Las contraseñas no coinciden';
			return;
		}

		if (this.password.length < 6) {
			this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
			return;
		}

		this.loading = true;
		this.errorMessage = '';

		try {
			const { data, error } = await this.supabaseService.signUp(this.email, this.password);
			if (error) {
				if (error.message.includes('duplicate key value') || error.message.includes('unique constraint "profiles_email_key"')) {
					throw new Error('Este correo electrónico ya está registrado');
				}
				throw error;
			}

			if (data) {
				// Mostrar mensaje de éxito
        this.messageService.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Por favor, verifica tu correo electrónico. Te hemos enviado un correo electrónico.', life: 3000 });
        // Esperar 6 segundos antes de redirigir al usuario a la página de inicio de sesión
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 6000);
			}
		} catch (error: any) {
			this.errorMessage = error.message || 'Error al registrar la cuenta';
		} finally {
			this.loading = false;
		}
	}
}