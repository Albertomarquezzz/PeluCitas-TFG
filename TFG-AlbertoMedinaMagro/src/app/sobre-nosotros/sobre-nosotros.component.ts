import { Component } from '@angular/core';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-sobre-nosotros',
  imports: [CarouselModule, NavbarComponent],  // No es necesario importar otros módulos si solo usas el carrusel
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent {

  // Agregar 3 imágenes para el carrusel
  images: any[] = [
    {
      url: '/assets/img/local1.png',
    },
    {
      url: '/assets/img/local2.png',
    },
    {
      url: '/assets/img/local3.png', 
    }
  ];

  // Opciones responsivas del carrusel
  responsiveOptions: CarouselResponsiveOptions[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}