import { Component, EventEmitter, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
  public value: number = 1.5;
  public min: number = 1.5;
  public max: number = 10;
  public step: number = 0.5;
  @Output() public progressChange: EventEmitter<MatSliderChange> =
    new EventEmitter<MatSliderChange>();

  public onProgressChange(event: MatSliderChange): void {
    this.value = event.value;
    this.progressChange.emit(event);
  }
}
