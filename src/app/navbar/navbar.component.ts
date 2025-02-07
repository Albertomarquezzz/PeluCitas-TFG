import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-navbar',
	imports: [NgIf, RouterLink],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css'
})
export class NavbarComponent {
	isLoggedIn: boolean = false;
	theme: string = 'light';

	checkLoginStatus() {
		// Logica para verificar si el usuario esta logueado
		const user = localStorage.getItem('authToken');
		this.isLoggedIn = !!user;
	}

	toggleTheme() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-bs-theme', this.theme);
		localStorage.setItem('theme', this.theme);
		const element = document.querySelector('html');
		if (element !== null) element.classList.toggle('my-app-dark');
	}

	ngOnInit() {
		this.checkLoginStatus();
		this.theme = localStorage.getItem('theme') || 'light';
		document.documentElement.setAttribute('data-bs-theme', this.theme);
	}
}
