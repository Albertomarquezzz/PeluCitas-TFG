import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
	transform(value: string): string {
		const date = new Date(value);
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		};
		return new Intl.DateTimeFormat('es-ES', options).format(date);
	}
}
