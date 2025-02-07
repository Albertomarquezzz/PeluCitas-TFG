import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
	providedIn: 'root'
})
export class SupabaseService {
	private supabase: SupabaseClient;

	constructor() {
		this.supabase = createClient('https://dldwuufuosksspogiuya.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZHd1dWZ1b3Nrc3Nwb2dpdXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMDM0NTMsImV4cCI6MjA1MzY3OTQ1M30.oidlV3KDYDaVVWDSh4r_cq7Lwg2UwSQj8RhO4ujA7io');
	}

	async signUp(email: string, password: string) {
		// Registra un nuevo usuario en Supabase Auth
		const { data, error } = await this.supabase.auth.signUp({
			email,
			password
		});

		// Insertar un nuevo usuario en la tabla 'profiles'
		if (data.user) {
			const { user } = data;
			await this.supabase.from('profiles').insert([
				{
					id: user.id,
					email: user.email,
					created_at: new Date()
				}
			]);
		}

		return { data, error };
	}

	async signIn(email: string, password: string) {
		const { data, error } = await this.supabase.auth.signInWithPassword({
			email,
			password
		});

		return { data, error };
	}

	// Método para obtener el usuario actual
	async getCurrentUser() {
		const user = await this.supabase.auth.getUser(); // Obtiene el usuario actual desde Supabase
		return user.data?.user; // Asegúrate de acceder a la propiedad 'user'
	}

	async signOut() {
		return this.supabase.auth.signOut(); // Cierra la sesión del usuario
	}

	// Obtener todos los servicios que hay actualmente en la base de datos
	async getServices() {
		const { data, error } = await this.supabase.from('services').select('*');
		return { data, error };
	}

	// Método para crear una reserva
	async createReservation(reservation: any) {
		const { data, error } = await this.supabase.from('reservations').insert([reservation]);
		return { data, error };
	}

	// Método para obtener todas las reservas
	async getReservations() {
		const { data, error } = await this.supabase.from('reservations').select(`
            id,
            user_id,
            service_id,
            reservation_date,
            created_at,
						status,
            services (name, category),
            profiles (email)
        `);
		return { data, error };
	}

	// Método para obtener las reservas del usuario actual
	async getUserReservations(userId: string) {
		const { data, error } = await this.supabase
			.from('reservations')
			.select(
				`
            id,
            user_id,
            service_id,
            reservation_date,
            created_at,
						status,
            services (name, category),
            profiles (email)
        `
			)
			.eq('user_id', userId);
		return { data, error };
	}

	// Método para obtener el rol del usuario actual
	async getUserRole(userId: string) {
		const { data, error } = await this.supabase.from('profiles').select('rol').eq('id', userId).single();
		return { data, error };
	}

	// Método para actualizar el estado de una reserva
	async updateReservationStatus(reservationId: string, status: string) {
		const { data, error } = await this.supabase.from('reservations').update({ status }).eq('id', reservationId);
		return { data, error };
	}

	// Método para obtener las reservas por fecha
	async getReservationsByDate(reservationDate: Date, duration: number) {
		const startOfReservation = new Date(reservationDate);
		const endOfReservation = new Date(startOfReservation.getTime() + duration * 60000);

		const { data, error } = await this.supabase.from('reservations').select('*').gte('reservation_date', startOfReservation.toISOString()).lt('reservation_date', endOfReservation.toISOString());

		return { data, error };
	}

	// Método para eliminar una reserva
	async deleteReservation(reservationId: string) {
		const { data, error } = await this.supabase.from('reservations').delete().eq('id', reservationId);
		return { data, error };
	}
}
