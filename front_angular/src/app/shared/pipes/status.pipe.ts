import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string  {
    if (value == 'verify') {
      return 'VERIFICADO';
    }else if (value == 'approved') {
      return 'APROBADO';
    }else if (value == 'rejected') {
      return 'RECHAZADO';
    }
    return 'PENDIENTE';
  }

}
