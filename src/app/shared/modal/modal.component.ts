import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service';

// NOTE ElementRef will be given access to the respective components host element
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalId = '';
  constructor(public modal: ModalService, private el: ElementRef) {
  }

  ngOnInit() {
    // we want to move the modal to the body tag to avoid inherit the css from its parent
    document.body.appendChild(this.el.nativeElement);
  }
  ngOnDestroy() {
    // Because we manually move modal outside body tag so that's why
    // we need to manually remove the modal here to avoid memory leak
    document.body.removeChild(this.el.nativeElement);
  }

  closeModal() {
    this.modal.toggleModal(this.modalId);
  }
}
