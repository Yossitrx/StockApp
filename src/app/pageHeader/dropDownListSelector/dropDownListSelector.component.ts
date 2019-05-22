import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dropDownListSelector',
  templateUrl: './dropDownListSelector.component.html',
  styleUrls: ['./dropDownListSelector.component.scss'],
})
export class DropDownListSelectorComponent {
  @Input() public disabled: boolean;
  @Input() public list: Set<string>;
  @Output() public selectionChange: EventEmitter<string> =
    new EventEmitter<string>();

  public onClick(event: string): void {
    this.selectionChange.emit(event);
  }
}
