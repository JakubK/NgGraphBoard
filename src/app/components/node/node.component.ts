import { Component, Input, OnInit } from '@angular/core';
import { Node } from 'src/app/models/node';
import { CursorService } from 'src/app/services/cursor.service';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input()
  node!: Node;

  constructor(private readonly cursorService: CursorService) { }

  ngOnInit(): void {
  }

  nodeClick(e: MouseEvent): void {
    this.cursorService.clickedNodes$$.next(this.node);
    e.stopPropagation();
  }
}
