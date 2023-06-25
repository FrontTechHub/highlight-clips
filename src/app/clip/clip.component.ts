import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  id = '';
  constructor(
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    // <!-- NOTE: Angular will destroy previous component when routing to another site (different component) -->
    // <!-- NOTE: but it is the same component then Angular won't destroy previous component -->

    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }
}
