import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority'
})
export class PriorityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string  {
    if (value == 'high') {
      return 'ALTO';
    }else if (value == 'medium') {
      return 'MEDIO';
    }else if (value == 'low') {
      return 'BAJO';
    }
    return '';
  }

}
