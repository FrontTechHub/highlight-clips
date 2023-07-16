import {
  Component, Input, OnDestroy, OnInit, OnChanges, Output,
  EventEmitter,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';
import IClip from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter<IClip>();

  showAlert = false;
  alertMsg = 'Please wait ! Updating clip...';
  alertColor = 'blue';
  inSubmission = false;

  clipId = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3),
    ],
    nonNullable: true,
  });
  editForm = new FormGroup({
    title: this.title,
    id: this.clipId,
  });

  constructor(
    private modal: ModalService,
    private clipService: ClipService,
  ) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy() {
    this.modal.unregister('editClip');
  }

  ngOnChanges() {
    // This method will be called whenever a component's properties are
    // updated by a parent component
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;

    if (this.activeClip.docId != null) {
      this.clipId.setValue(this.activeClip.docId);
    }
    this.title.setValue(this.activeClip.title);
  }

  async updateClip() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Updating clip...';
    this.alertColor = 'blue';
    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Please try again later';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }
}
