import { Component, OnInit } from '@angular/core';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-inicio',
	imports: [CarouselModule, ButtonModule, NavbarComponent], // No necesitamos TagModule
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	// Datos con las imágenes de los cortes de cabello
	products: any[] = [
		{
			image: '/assets/img/corte1.png'
		},
		{
			image: '/assets/img/corte2.png'
		},
		{
			image: '/assets/img/corte3.png'
		},
		{
			image: '/assets/img/corte4.png'
		},
		{
			image: '/assets/img/corte5.png'
		}
	];

	responsiveOptions: any[] | undefined;

	constructor() {}

	ngOnInit(): void {
		this.responsiveOptions = [
			{
				breakpoint: '2400px',
				numVisible: 4,
				numScroll: 1
			},
			{
				breakpoint: '1920px',
				numVisible: 3,
				numScroll: 1
			},
			{
				breakpoint: '1600px',
				numVisible: 2,
				numScroll: 1
			},
			{
				breakpoint: '1400px',
				numVisible: 2,
				numScroll: 1
			},
			{
				breakpoint: '1199px',
				numVisible: 1,
				numScroll: 1
			},
			{
				breakpoint: '767px',
				numVisible: 1,
				numScroll: 1
			},
			{
				breakpoint: '575px',
				numVisible: 1,
				numScroll: 1
			}
		];
	}
}