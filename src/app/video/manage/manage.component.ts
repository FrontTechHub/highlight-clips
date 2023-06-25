import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
    });
  }

  sort($event: Event) {
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
}
