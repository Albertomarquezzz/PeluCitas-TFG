import { Component, Input, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';

@Component({
	selector: 'custom-datepicker',
	template: `
		<!-- Usamos el componente p-datepicker de PrimeNG -->
		<p-datepicker inputId="calendar-24h" [showTime]="showTime" [dateFormat]="dateFormat" [(ngModel)]="value" (ngModelChange)="onInputChange($event)" (onShow)="onPanelShow()" [disabledDays]="disabledDays" [iconDisplay]="'input'" [showIcon]="showIcon"></p-datepicker>
	`,
	styles: [],
	imports: [DatePickerModule, FormsModule, TagModule]
})
export class CustomDatepickerComponent implements AfterViewInit {
	// Horas que se desean deshabilitar, por ejemplo: [0, 1, 2, 3]
	@Input() disabledHours: number[] = [];

	// Propiedades para p-datapicker
	@Input() inputId: string = '';
	@Input() showTime: boolean = true;
	@Input() dateFormat: string = 'dd/mm/yy';
	@Input() disabledDays: number[] = [];
	@Input() iconDisplay: string = 'input';
	@Input() showIcon: boolean = true;
	@Input() value: Date | null = null;

	@ViewChild('datepicker') datepicker: any;

	private hourObserver: MutationObserver | null = null;

	constructor(private renderer: Renderer2, private el: ElementRef) {}

	ngAfterViewInit() {
		// Inicialmente no es necesario nada aquí, se configura al mostrar el panel.
	}

	/**
	 * Se ejecuta cuando se muestra el panel del p-datapicker.
	 * Configuramos la lógica de deshabilitado tanto en la carga inicial
	 * como cuando se modifique la hora mediante los botones.
	 */
	onPanelShow() {
		// Usamos setTimeout para asegurarnos de que el panel se haya renderizado
		setTimeout(() => {
			const dpElement = this.el.nativeElement.querySelector('.p-datepicker');
			if (dpElement) {
				const timePanel = dpElement.querySelector('.p-datepicker-time-picker');
				if (timePanel) {
					const hourPicker = timePanel.querySelector('.p-datepicker-hour-picker');
					if (hourPicker) {
						const hourSpan: HTMLElement = hourPicker.querySelector('span');
						if (hourSpan) {
							// Aplicamos la validación inicial
							this.applyDisabledHours(hourPicker, hourSpan);

							// Configuramos el MutationObserver para detectar cambios en el contenido del span
							if (this.hourObserver) {
								this.hourObserver.disconnect();
							}
							this.hourObserver = new MutationObserver((mutations) => {
								mutations.forEach(() => {
									this.applyDisabledHours(hourPicker, hourSpan);
								});
							});
							// Observamos cambios en el contenido textual del span (childList y characterData)
							this.hourObserver.observe(hourSpan, { characterData: true, childList: true, subtree: true });
						}
					}
				}
			}
		}, 0);
	}

	/**
	 * Función que verifica la hora actual mostrada y aplica la clase 'p-disabled'
	 * al span y a los botones de incremento/decremento si la hora se encuentra en disabledHours.
	 */
	private applyDisabledHours(hourPicker: HTMLElement, hourSpan: HTMLElement) {
		// Primero, limpiamos clases previas
		this.renderer.removeClass(hourSpan, 'p-disabled');
		const buttons = hourPicker.querySelectorAll('button');
		buttons.forEach((btn: HTMLElement) => {
			this.renderer.removeClass(btn, 'p-disabled');
			btn.style.pointerEvents = '';
		});

		const hourText = hourSpan.innerText.trim();
		const hour = parseInt(hourText, 10);

		if (this.disabledHours.includes(hour)) {
			// Agregamos la clase de PrimeNG que ya se encarga del estilo deshabilitado
			this.renderer.addClass(hourSpan, 'p-disabled');
			buttons.forEach((btn: HTMLElement) => {
				this.renderer.addClass(btn, 'p-disabled');
				btn.style.pointerEvents = 'none';
			});
		}
	}

	/**
	 * Se ejecuta cuando el usuario modifica el valor (ya sea manualmente o mediante el picker).
	 * Si la hora resultante está en disabledHours, se borra el valor.
	 */
	onInputChange(newValue: Date): void {
		// Verificamos que el nuevo valor sea una fecha válida
		if (newValue instanceof Date && !isNaN(newValue.getTime())) {
			const hour = newValue.getHours();
			if (this.disabledHours.includes(hour)) {
				// Si la hora es deshabilitada, se limpia el modelo y el input
				this.value = null;
				// También se limpia el valor del input para reflejar el cambio
				const inputElement: HTMLInputElement = this.el.nativeElement.querySelector('input.p-datepicker-input');
				if (inputElement) {
					this.renderer.setProperty(inputElement, 'value', '');
				}
			}
		}
	}

	ngOnDestroy() {
		// Desconectamos el observer si está activo para evitar fugas de memoria
		if (this.hourObserver) {
			this.hourObserver.disconnect();
		}
	}
}
