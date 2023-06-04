import { Component, Input, OnInit, ElementRef } from '@angular/core';
import {ModalService} from "../../services/modal.service";

// NOTE ElementRef will be given access to the respective components host element
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() modalId = '';
  constructor(public modal: ModalService, private el: ElementRef) {
  }

  ngOnInit() {
    document.body.appendChild(this.el.nativeElement);
  }

  closeModal() {
    this.modal.toggleModal(this.modalId);
  }
}
