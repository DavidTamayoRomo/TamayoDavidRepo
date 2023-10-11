import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string  {
    if (value == 'error') {
      return 'ERROR';
    }else if (value == 'incident') {
      return 'INCIDENTE';
    }else if (value == 'support') {
      return 'SOPORTE';
    }
    return '';
  }

}
