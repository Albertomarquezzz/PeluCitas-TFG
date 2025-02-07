import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { RegisterComponent } from './register/register.component'; 
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { LogoutComponent } from './logout/logout.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: 'inicio', component: InicioComponent }, // Definir la ruta para el componente de inicio
	{ path: 'login', component: LoginComponent }, // Definir la ruta para el componente de login
	{ path: 'logout', component: LogoutComponent }, // Definir la ruta para el componente de logout
	{ path: 'crear-cuenta', component: RegisterComponent }, // Definir la ruta para el componente de register
	{ path: 'sobre-nosotros', component: SobreNosotrosComponent }, // Definir la ruta para el componente de Sobre Nosotros
	{ path: 'reservations', component: ReservationsComponent, canActivate: [AuthGuard] }, // Definir la ruta para el componente de Reservations
	{ path: '', redirectTo: '/inicio', pathMatch: 'full' } // Redirigir a inicio por defecto
];