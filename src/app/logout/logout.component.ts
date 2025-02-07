import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'logout',
	imports: [],
	templateUrl: './logout.component.html',
	styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
	constructor(private router: Router) {}

	ngOnInit() {
    localStorage.clear();
		// Redirect to home page after logout
		this.router.navigate(['/']);
	}
}
