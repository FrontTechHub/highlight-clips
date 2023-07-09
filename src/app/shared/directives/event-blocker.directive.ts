import { Directive, HostListener } from '@angular/core';
// HostListener perform 2 action:
// First it also let the host element
// Secondly, it will listen to an event on the hoist
@Directive({
  selector: '[appEventBlocker]'
})

// This directive is used to prevent the default behavior of the
// hoist elements events
export class EventBlockerDirective {
  // The drop event is emitted when the user has released an element or text
  // selection on an element, this event can be triggered when the user
  // releases their mouse or by pressing the escape key.

  // The drag over event is emitted when an element pr selection is
  // dragged over an element, this event can cause the file to be opened
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event) {
    event.preventDefault();
  }
}
