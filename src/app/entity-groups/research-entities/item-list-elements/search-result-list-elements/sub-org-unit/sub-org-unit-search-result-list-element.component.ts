import { Component,Inject } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { ItemMetadataRepresentation } from 'src/app/core/shared/metadata-representation/item/item-metadata-representation.model';
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { MetadataRepresentation, MetadataRepresentationType } from 'src/app/core/shared/metadata-representation/metadata-representation.model';
import { RelationshipDataService } from 'src/app/core/data/relationship-data.service';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';
import { map } from 'rxjs/operators';
import { getItemPageRoute } from 'src/app/item-page/item-page-routing-paths';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { TruncatableService } from 'src/app/shared/truncatable/truncatable.service';
import { LinkService } from 'src/app/core/cache/builders/link.service';
import { VirtualMetadataFieldsService } from 'src/app/core/services/virtual-metadata-fields.service';
@listableObjectComponent('AdministrationSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-sub-org-unit-search-result-list-element',
  styleUrls: ['./sub-org-unit-search-result-list-element.component.scss'],
  templateUrl: './sub-org-unit-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Organisation Unit
 */
export class SubOrgUnitSearchResultListElementComponent extends ItemSearchResultListElementComponent {

  /**
   * Display thumbnail if required by configuration
   */
  showThumbnails: boolean;


 mdRepresentation$: Observable<ItemMetadataRepresentation | null>;

 /**
  * The route to the item represented by this virtual metadata value (otherwise null)
  */
 mdRepresentationItemRoute$: Observable<string | null>;

 /**
  * The name of the item represented by this virtual metadata value (otherwise null)
  */
 mdRepresentationName$: Observable<string | null>;
 metadatValues :any;
 constructor(protected relationshipService: RelationshipDataService,
  protected truncatableService: TruncatableService,
  protected virtualMetadataFieldsService:VirtualMetadataFieldsService ,
                     protected dsoNameService: DSONameService,
                     protected linkService: LinkService, //kware-edit
                     @Inject(APP_CONFIG) protected appConfig?: AppConfig
) {
   super(truncatableService,dsoNameService,linkService);
 }


  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    this.initVirtualProperties();
    this.mdRepresentation$.subscribe(md=>{this.metadatValues= md.allMetadata('organization.legalName') })
    this.mdRepresentationName$.subscribe(md=>{console.log(md)})
    //  this.virtualMetadataFieldsService.initVirtualProperties(this.dso,'organization.legalName').subscribe(data=>{console.log("data",data.allMetadata('organization.legalName'))})
  }
  /**
   * Initialise potential properties of a virtual metadata value
   */
  initVirtualProperties(): void {
    this.mdRepresentation$ = this.dso.allMetadata('organization.legalName')[0].isVirtual ?
      this.relationshipService.resolveMetadataRepresentation(this.dso.allMetadata('organization.legalName')[0], this.dso, 'Item')
        .pipe(
          map((mdRepresentation: MetadataRepresentation) =>
            mdRepresentation.representationType === MetadataRepresentationType.Item ? mdRepresentation as ItemMetadataRepresentation : null
          )
        ) : EMPTY;
    this.mdRepresentationItemRoute$ = this.mdRepresentation$.pipe(
      map((mdRepresentation: ItemMetadataRepresentation) => mdRepresentation ? getItemPageRoute(mdRepresentation) : null),
    );
    this.mdRepresentationName$ = this.mdRepresentation$.pipe(
      map((mdRepresentation: ItemMetadataRepresentation) => mdRepresentation ? this.dsoNameService.getName(mdRepresentation) : null),
    );
  }
}
