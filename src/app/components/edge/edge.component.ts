import { Component, Input, OnInit } from '@angular/core';
import { Edge } from 'src/app/models/edge';

@Component({
  selector: '[edge]',
  templateUrl: './edge.component.html',
  styleUrls: ['./edge.component.scss']
})
export class EdgeComponent implements OnInit {
  @Input()
  data!: Edge;
  constructor() { }

  ngOnInit(): void {
  }

}
