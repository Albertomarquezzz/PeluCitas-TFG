import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MessageService, SelectItem } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormatDatePipe } from '../shared/pipes/format-date.pipe';
import { CustomDatepickerComponent } from '../customdatapicker/customdatapicker.component';

@Component({
	selector: 'app-reservations',
	templateUrl: './reservations.component.html',
	styleUrl: './reservations.component.css',
	imports: [TableModule, ToastModule, FormsModule, CustomDatepickerComponent, DatePickerModule, AutoCompleteModule, ButtonModule, TagModule, SelectModule, NgIf, NavbarComponent, InputTextModule, FormatDatePipe],
	providers: [MessageService]
})
export class ReservationsComponent implements OnInit {
	services: any[] = [];
	reservations: any[] = [];
	selectedService: any;
	reservationDate: Date = new Date();
	loading: boolean = false;
	errorMessage: string = '';
	first = 0;
	rows = 10;
	statuses!: SelectItem[];
	clonedReservations: { [s: string]: any } = {};
	userRole: string = '';

	constructor(private supabaseService: SupabaseService, private messageService: MessageService) {}

	async ngOnInit() {
		await this.loadReservations();

		this.statuses = [
			{ label: 'Pendiente', value: 'pending' },
			{ label: 'Aprobada', value: 'approved' },
			{ label: 'Rechazada', value: 'rejected' }
		];
	}

	async loadReservations() {
		const user = await this.supabaseService.getCurrentUser();
		if (!user) {
			this.errorMessage = 'Usuario no autenticado';
			return;
		}

		const { data: userRoleData, error: userRoleError } = await this.supabaseService.getUserRole(user.id);
		if (userRoleError) {
			this.errorMessage = 'Error al obtener el rol del usuario';
			return;
		}

		if (!userRoleData) {
			this.errorMessage = 'Rol de usuario no encontrado';
			return;
		}

		this.userRole = userRoleData.rol;

		if (userRoleData.rol === 'admin') {
			const { data: reservationsData, error: reservationsError } = await this.supabaseService.getReservations();
			if (reservationsError) {
				this.errorMessage = 'Error al cargar las reservas';
				return;
			}
			this.reservations = reservationsData || [];
		} else {
			const { data: reservationsData, error: reservationsError } = await this.supabaseService.getUserReservations(user.id);
			if (reservationsError) {
				this.errorMessage = 'Error al cargar las reservas';
				return;
			}
			this.reservations = reservationsData || [];
		}
	}

	async search() {
		this.loading = true;
		this.errorMessage = '';

		const { data, error } = await this.supabaseService.getServices();
		if (error) {
			this.errorMessage = 'Error al cargar los servicios';
			this.loading = false;
			return;
		}

		if (data) {
			this.services = data;
		}
		this.loading = false;
	}

	async createReservation() {
		this.loading = true;
		this.errorMessage = '';

		const user = await this.supabaseService.getCurrentUser();
		if (!user) {
			this.errorMessage = 'Usuario no autenticado';
			this.loading = false;
			return;
		}

		const service = this.services.find((s) => s.id === this.selectedService.id);
		if (!service) {
			this.errorMessage = 'Servicio no encontrado';
			this.loading = false;
			return;
		}

		const { data: existingReservations, error: existingReservationsError } = await this.supabaseService.getReservationsByDate(this.reservationDate, service.duration);
		if (existingReservationsError) {
			this.errorMessage = 'Error al verificar las reservas existentes';
			this.loading = false;
			return;
		}

		if (existingReservations && existingReservations.length > 0) {
			this.errorMessage = 'Ya existe una reserva en la misma fecha y hora';
			this.loading = false;
			return;
		}

		const reservation = {
			user_id: user.id,
			service_id: this.selectedService.id,
			reservation_date: this.reservationDate,
			status: 'pending'
		};

		const { data, error } = await this.supabaseService.createReservation(reservation);
		if (error) {
			this.errorMessage = 'Error al crear la reserva';
			this.loading = false;
			return;
		}

		if (data) {
			this.reservations.push(data[0]);
		}
		this.loading = false;
		this.first = 0;
		await this.loadReservations();
		this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservas actualizadas' });
	}

	next() {
		this.first = this.first + this.rows;
	}

	prev() {
		this.first = this.first - this.rows;
	}

	async reset() {
		this.first = 0;
		await this.loadReservations();
		this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservas actualizadas' });
	}

	pageChange(event: { first: number; rows: number }) {
		this.first = event.first;
		this.rows = event.rows;
	}

	isLastPage(): boolean {
		return this.reservations ? this.first + this.rows >= this.reservations.length : true;
	}

	isFirstPage(): boolean {
		return this.reservations ? this.first === 0 : true;
	}

	onRowEditInit(reservation: any) {
		this.clonedReservations[reservation.id as string] = { ...reservation };
	}

	async onRowEditSave(reservation: any) {
		delete this.clonedReservations[reservation.id as string];
		this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reserva actualizada' });
		await this.supabaseService.updateReservationStatus(reservation.id, reservation.status);
	}

	onRowEditCancel(reservation: any, index: number) {
		this.reservations[index] = this.clonedReservations[reservation.id as string];
		delete this.clonedReservations[reservation.id as string];
	}

	getSeverity(status: string) {
		switch (status) {
			case 'pending':
				return 'info';
			case 'approved':
				return 'success';
			case 'rejected':
				return 'danger';
			default:
				return 'secondary';
		}
	}

	// Eliminar una reserva de la tabla y tambien de supabase
	async deleteRow(reservation: any) {
		this.reservations = this.reservations.filter((val) => val.id !== reservation.id);
		await this.supabaseService.deleteReservation(reservation.id);
		this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reserva eliminada' });
	}
}
