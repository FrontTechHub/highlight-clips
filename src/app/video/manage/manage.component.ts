import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import IClip from '../../models/clip.model';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService,
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
      this.sort$.next(this.videoOrder);
    });
    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = [];
      docs.forEach(doc => {
        this.clips.push(({
          docId: doc.id,
          ...doc.data(),
        }));
      })
    });
  }

  public sort($event: Event) {
    // NOTE: As a best practice the for using Path and Query params
    // Path Parameters - Should be used for returning a single resource or multiple resources.
    // Query Parameters - Should be used for sorting/filtering through data
    const { value } = ($event.target as HTMLSelectElement)

    // navigateByUrl or navigateByUrl can used for this case,
    // With navigate we have power control than navigateByUrl method
    // this.router.navigateByUrl(`/manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  public openModal($event: Event, clip: IClip) {
    $event.preventDefault();

    this.activeClip = clip;
    this.modal.toggleModal('editClip');
  }

  public update($event: IClip) {
    this.clips.forEach((clip, index) => {
      if (clip.docId === $event.docId) {
        this.clips[index].title = $event.title;
      }
    })
  }

  public async deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    await this.clipService.deleteClip(clip);

    this.clips.forEach((ele, index) => {
      if (ele.docId === clip.docId) {
        this.clips.splice(index, 1);
      }
    })
  }
}
