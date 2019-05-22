import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { PageHeaderComponent } from './pageHeader';
import { StockService } from './pageHeader/stockService/stock.service';
import { UserPortfolioComponent } from './pageHeader/userPortfolio/userPortfolio.component';
import { HttpClientModule } from '@angular/common/http';
import { SliderComponent } from './pageHeader/userPortfolio/slider/slider.component';
// tslint:disable-next-line:max-line-length
import { TransformationServices } from './pageHeader/transformationServices/transformation.services';
// tslint:disable-next-line:max-line-length
import { ApiErrorHandlerService } from './pageHeader/apiErrorHandlerService/apiErrorHandler.service';
// tslint:disable-next-line:max-line-length
import { DropDownListSelectorComponent } from './pageHeader/dropDownListSelector/dropDownListSelector.component';
import { ProgressService } from './pageHeader/progressService/progressService.service';

@NgModule({
  declarations: [
    AppComponent,
    PageHeaderComponent,
    UserPortfolioComponent,
    SliderComponent,
    DropDownListSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    StockService,
    TransformationServices,
    ApiErrorHandlerService,
    ProgressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
