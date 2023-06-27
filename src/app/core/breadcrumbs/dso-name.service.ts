import { Injectable } from '@angular/core';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';
import { TranslateService } from '@ngx-translate/core';
import { Metadata } from '../shared/metadata.utils';
import { LocaleService } from '../locale/locale.service';

/**
 * Returns a name for a {@link DSpaceObject} based
 * on its render types.
 */
@Injectable({
  providedIn: 'root'
})
export class DSONameService {

    //kware-edit check locale
    localeAr: boolean;
    localeEn: boolean;
    arabicLang: boolean;
    englishLang: boolean;
    title: string; // kware-edit
    AdministrationName: string; // kware-edit
    OrgUnitName:string // kware-edit
    PlaceName:string // kware-edit
    SiteName:string // kware-edit
    EventName:string // kware-edit
    EraName:string // kware-edit
    ActivityName:string // kware-edit
    SeriesName: string // kware-edit
    ProjectName: string // kware-edit

  

  constructor(private translateService: TranslateService,
    public localeService: LocaleService , /* kware edit - call service from LocaleService */

    ) {

  }

  /**
   * Functions to generate the specific names.
   *
   * If this list ever expands it will probably be worth it to
   * refactor this using decorators for specific entity types,
   * or perhaps by using a dedicated model for each entity type
   *
   * With only two exceptions those solutions seem overkill for now.
   */
  private readonly factories = {
    EPerson: (dso: DSpaceObject): string => {
      const firstName = dso.firstMetadataValue('eperson.firstname');
      const lastName = dso.firstMetadataValue('eperson.lastname');
      if (isEmpty(firstName) && isEmpty(lastName)) {
        return this.translateService.instant('dso.name.unnamed');
      } else if (isEmpty(firstName) || isEmpty(lastName)) {
        return firstName || lastName;
      } else {
        return `${firstName} ${lastName}`;
      }
    },
    Person: (dso: DSpaceObject): string => {
      const familyName = this.localeService.getStringByLocale(dso.firstMetadataValue('person.familyName')) ;
      const givenName = this.localeService.getStringByLocale(dso.firstMetadataValue('person.givenName'));
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
      if(this.localeAr && dso.firstMetadataValue('person.name')){
        return this.localeService.getStringByLocale(dso.firstMetadataValue('person.name')) || dso.name;
      }
      else if(this.localeEn && !!dso.firstMetadataValue('person.name.alternative')){
        return this.localeService.getStringByLocale(dso.firstMetadataValue('person.name.alternative')) || dso.name;
      }
      else if(this.localeEn && !dso.firstMetadataValue('person.name.alternative')){
        return this.localeService.getStringByLocale(dso.firstMetadataValue('person.name')) || dso.name;
      }
    else  if ((isEmpty(familyName) || isEmpty(givenName)) && isNotEmpty(dso.firstMetadataValue('dspace.object.owner'))) {
        return this.localeService.getStringByLocale(dso.firstMetadataValue('dspace.object.owner')) || dso.name;
      }
      else if (isEmpty(familyName) || isEmpty(givenName)) {
        return familyName || givenName;
      }else if   ((isEmpty(familyName) && isEmpty(givenName))&& isEmpty(dso.firstMetadataValue('dspace.object.owner'))) {
        return this.localeService.getStringByLocale(dso.firstMetadataValue('dc.title')) || dso.name;
      } 
     
       else {
        return this.convertComma(`${familyName}, ${givenName}`);
      }
    },
    OrgUnit: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
              this.OrgUnitName = dso.firstMetadataValue('organization.legalName');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('organization.legalName.alternative') ) :
                this.OrgUnitName = dso.firstMetadataValue('organization.legalName');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('organization.legalName.alternative') ) :
              this.OrgUnitName = dso.firstMetadataValue('organization.legalName.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('organization.legalName.alternative') ) :
                this.OrgUnitName = this.localeService.getStringByLocale(dso.firstMetadataValue('organization.legalName'));
                break;
   
       }
      return  this.localeService.getStringByLocale(this.OrgUnitName);
    },
    Administration: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
              this.AdministrationName = dso.firstMetadataValue('organization.childLegalName');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('organization.childLegalName.alternative') ) :
                this.AdministrationName = dso.firstMetadataValue('organization.childLegalName');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('organization.childLegalName.alternative') ) :
              this.AdministrationName = dso.firstMetadataValue('organization.childLegalName.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('organization.childLegalName.alternative') ) :
                this.AdministrationName = this.localeService.getStringByLocale(dso.firstMetadataValue('organization.childLegalName'));
                break;
   
       }
      return this.localeService.getStringByLocale(this.AdministrationName);
    },
    Place: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
            this.PlaceName = dso.firstMetadataValue('place.legalName');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('place.legalName.alternative') ) :
                this.PlaceName = dso.firstMetadataValue('place.legalName');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('place.legalName.alternative') ) :
              this.PlaceName = dso.firstMetadataValue('place.legalName.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('place.legalName.alternative') ) :
                this.PlaceName = this.localeService.getStringByLocale(dso.firstMetadataValue('place.legalName'));
                break;
   
       }
      return this.localeService.getStringByLocale(this.PlaceName);
    },
    Event: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
            this.EventName = dso.firstMetadataValue('event.title');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('event.title.alternative') ) :
                this.EventName = dso.firstMetadataValue('event.title');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('event.title.alternative') ) :
              this.EventName = dso.firstMetadataValue('event.title.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('event.title.alternative') ) :
                this.EventName = this.localeService.getStringByLocale(dso.firstMetadataValue('event.title'));
                break;
   
       }
      return this.localeService.getStringByLocale(this.EventName);
    },
    Era: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
            this.EraName = dso.firstMetadataValue('era.title');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('era.title.alternative') ) :
                this.EraName = dso.firstMetadataValue('era.title');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('era.title.alternative') ) :
              this.EraName = dso.firstMetadataValue('era.title.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('era.title.alternative') ) :
                this.EraName = this.localeService.getStringByLocale(dso.firstMetadataValue('era.title'));
                break;
   
       }
      return this.localeService.getStringByLocale(this.EraName);
    },
    Series: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
            this.SeriesName = dso.firstMetadataValue('series.name');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('series.name.alternative') ) :
                this.SeriesName = dso.firstMetadataValue('series.name');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('series.name.alternative') ) :
              this.SeriesName = dso.firstMetadataValue('series.name.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('series.name.alternative') ) :
                this.SeriesName = this.localeService.getStringByLocale(dso.firstMetadataValue('series.name'));
                break;
   
       }
      return this.localeService.getStringByLocale(this.SeriesName);
    },
    Project: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
            this.ProjectName = dso.firstMetadataValue('project.name');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('project.name.alternative') ) :
                this.ProjectName = dso.firstMetadataValue('project.name');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('project.name.alternative') ) :
              this.ProjectName = dso.firstMetadataValue('project.name.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('project.name.alternative') ) :
                this.ProjectName = this.localeService.getStringByLocale(dso.firstMetadataValue('project.name'));
                break;
   
       }
      return this.localeService.getStringByLocale(this.ProjectName);
    },
    Site: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
            this.SiteName = dso.firstMetadataValue('place.childLegalName');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('place.childLegalName.alternative') ) :
                this.SiteName = dso.firstMetadataValue('place.childLegalName');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('place.childLegalName.alternative') ) :
              this.SiteName = dso.firstMetadataValue('place.childLegalName.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('place.childLegalName.alternative') ) :
                this.SiteName = this.localeService.getStringByLocale(dso.firstMetadataValue('place.childLegalName'));
                break;
   
       }
      return this.localeService.getStringByLocale(this.SiteName);
    },
    Activity: (dso: DSpaceObject): string => {
      this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
      this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
       switch (true){
           case (this.localeAr):
            this.ActivityName = dso.firstMetadataValue('event.childTitle');
              break;
              case (this.localeAr && !!dso.firstMetadataValue('event.childTitle.alternative') ) :
                this.ActivityName = dso.firstMetadataValue('event.childTitle');
                break;
            case (this.localeEn && !!dso.firstMetadataValue('event.childTitle.alternative') ) :
              this.ActivityName = dso.firstMetadataValue('event.childTitle.alternative');
              break;
              case (this.localeEn  && !dso.firstMetadataValue('event.childTitle.alternative') ) :
                this.ActivityName = this.localeService.getStringByLocale(dso.firstMetadataValue('event.childTitle'));
                break;
   
       }
      return this.localeService.getStringByLocale(this.ActivityName);
    },
    Default: (dso: DSpaceObject): string => {
            // If object doesn't have dc.title metadata use name property
             // kware-edit keywords end
   // kware-edit replace title ith alternative-title of items based on langugae

   this.localeAr = this.localeService.getCurrentLanguageCode() === 'ar';
   this.localeEn = this.localeService.getCurrentLanguageCode()   === 'en';
   this.arabicLang = dso.firstMetadataValue('dc.language.iso') === 'Arabic | العربية';
   this.englishLang = dso.firstMetadataValue('dc.language.iso') === 'English | الإنجليزية';

    switch (true){
        case (this.localeAr && this.arabicLang):
           this.title = dso.firstMetadataValue('dc.title');
           break;
         case (this.localeAr && !this.arabicLang && !!dso.firstMetadataValue('dc.title.alternative')  ):
           this.title = this.localeService.getStringByLocale(dso.firstMetadataValue('dc.title'));
           break;
         case (this.localeAr && !this.arabicLang  && !dso.firstMetadataValue('dc.title.alternative') ):
           this.title = dso.firstMetadataValue('dc.title');
           break;
         case (this.localeEn && this.englishLang) :
           this.title = dso.firstMetadataValue('dc.title');
           break;
          case (this.localeEn && !this.englishLang && !!dso.firstMetadataValue('dc.title.alternative')  ) :
             this.title = dso.firstMetadataValue('dc.title.alternative');
             break;
           case (this.localeEn && !this.englishLang && !dso.firstMetadataValue('dc.title.alternative') ) :
             this.title = this.localeService.getStringByLocale(dso.firstMetadataValue('dc.title'));
             break;

    }
    //kware-edit end
      return dso.firstMetadataValue('dc.title') || dso.name || this.translateService.instant('dso.name.untitled');
    }
  };

  /**
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getName(dso: DSpaceObject | undefined): string {
    if (dso) {
      const types = dso.getRenderTypes();
      const match = types
        .filter((type) => typeof type === 'string')
        .find((type: string) => Object.keys(this.factories).includes(type)) as string;

      let name;
      if (hasValue(match)) {
        name = this.localeService.getStringByLocale(this.factories[match](dso));
      }
      if (isEmpty(name)) {
        name = this.localeService.getStringByLocale(this.factories.Default(dso)) ;
      }
      return this.localeService.getStringByLocale(name);
    } else {
      return '';
    }
  }

  /**
   * Gets the Hit highlight
   *
   * @param object
   * @param dso
   *
   * @returns {string} html embedded hit highlight.
   */
  getHitHighlights(object: any, dso: DSpaceObject): string {
    const types = dso.getRenderTypes();
    const entityType = types
      .filter((type) => typeof type === 'string')
      .find((type: string) => (['Person', 'OrgUnit']).includes(type)) as string;
    if (entityType === 'Person') {
      const familyName = this.firstMetadataValue(object, dso, 'person.familyName');
      const givenName = this.firstMetadataValue(object, dso, 'person.givenName');
      if (isEmpty(familyName) && isEmpty(givenName)) {
        return this.firstMetadataValue(object, dso, 'dc.title') || dso.name;
      } else if (isEmpty(familyName) || isEmpty(givenName)) {
        return familyName || givenName;
      }
      return `${familyName}, ${givenName}`;
    } else if (entityType === 'OrgUnit') {
      return this.firstMetadataValue(object, dso, 'organization.legalName');
    }
    return this.firstMetadataValue(object, dso, 'dc.title') || dso.name || this.translateService.instant('dso.name.untitled');
  }

  /**
   * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param object
   * @param dso
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   *
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(object: any, dso: DSpaceObject, keyOrKeys: string | string[]): string {
    return Metadata.firstValue([object.hitHighlights, dso.metadata], keyOrKeys);
  }
  // replace comma ', or ;' to '،' if language  is Arabic
  convertComma(str: any){
    let newstr = '';
    if (this.localeService.getCurrentLanguageCode() === 'ar'){
      let regx = /;|,/gi;
     newstr = str.replace(regx, '،');
     return newstr;

    } else {
      return str;
    }
  }
}
