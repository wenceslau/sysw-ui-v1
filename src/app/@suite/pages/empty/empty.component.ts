import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    const r = this.route.snapshot.params['router'];
    const id = this.route.snapshot.params['id'];
    let posPath = '';
    if (id)
      posPath = '/' + id;

    this.router.navigate(['/' + r + posPath]);
  }
}
