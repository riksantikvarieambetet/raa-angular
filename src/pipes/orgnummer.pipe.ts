import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orgnummer' })
export class OrgnummerPipe implements PipeTransform {
  constructor() {}

  transform(organisationNr: string): string {
    if (organisationNr.length === 12) {
      organisationNr = organisationNr.substring(2);
    }

    if (organisationNr.length !== 10) {
      return organisationNr;
    }

    return organisationNr.substring(0, 6) + '-' + organisationNr.substring(6);
  }
}
