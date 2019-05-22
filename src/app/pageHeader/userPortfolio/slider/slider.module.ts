import { NgModule } from '@angular/core';
import { SliderComponent } from './slider.component';
import { MatSliderModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import 'hammerjs';

@NgModule({
  declarations: [
    SliderComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    MatSelectModule
  ],
  exports: [
    SliderComponent,
  ],
  providers: [],
})
export class SliderModule {
}
