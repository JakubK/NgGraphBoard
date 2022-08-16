import { Component, Input, OnInit } from '@angular/core';
import { Position } from '../../models/position';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {

  @Input()
  position!: Position;

  constructor() { }

  ngOnInit(): void {
  }

}
